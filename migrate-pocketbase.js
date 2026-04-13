/**
 * PocketBase Migration Script
 * Migrates collections from a local PocketBase instance to a remote one
 * 
 * Usage: node migrate-pocketbase.js
 * 
 * Requirements:
 * - Node.js
 * - npm install pocketbase
 */

const PocketBase = require('pocketbase').default;

// ============================================
// CONFIGURATION - Update these values
// ============================================

const LOCAL_CONFIG = {
  url: 'http://127.0.0.1:8090',
  email: 'opencode@gmail.com',
  password: 'opencode@gmail.com'
};

const REMOTE_CONFIG = {
  url: 'https://dmspocket.pockethost.io/',
  email: 'swamisantosh@gmail.com',
  password: 'pockethost.io'
};

// Collection name prefix to migrate (empty string = all collections)
const COLLECTION_PREFIX = 'egcsheet';

// ============================================
// MIGRATION LOGIC
// ============================================

async function migrate() {
  console.log('🔄 Starting PocketBase Migration...\n');
  console.log(`📍 Local:  ${LOCAL_CONFIG.url}`);
  console.log(`📍 Remote: ${REMOTE_CONFIG.url}`);
  console.log(`📋 Prefix: ${COLLECTION_PREFIX || '(all)'}\n`);

  const localPb = new PocketBase(LOCAL_CONFIG.url);
  const remotePb = new PocketBase(REMOTE_CONFIG.url);

  try {
    // Connect to both instances
    console.log('📡 Connecting to LOCAL PocketBase...');
    await localPb.admins.authWithPassword(LOCAL_CONFIG.email, LOCAL_CONFIG.password);
    console.log('✅ Connected to LOCAL\n');

    console.log('📡 Connecting to REMOTE PocketBase...');
    await remotePb.admins.authWithPassword(REMOTE_CONFIG.email, REMOTE_CONFIG.password);
    console.log('✅ Connected to REMOTE\n');

    // Get all collections from local
    console.log('📋 Fetching collections from LOCAL...');
    const collectionsResult = await localPb.collections.getList(1, 500);
    const collections = collectionsResult.items;

    // Filter by prefix if specified
    const targetCollections = COLLECTION_PREFIX
      ? collections.filter(c => c.name.startsWith(COLLECTION_PREFIX))
      : collections;

    if (targetCollections.length === 0) {
      console.log('❌ No collections found matching the prefix.\n');
      return;
    }

    console.log(`Found ${targetCollections.length} collection(s):\n`);
    targetCollections.forEach(c => console.log(`  - ${c.name}`));
    console.log('');

    // Migrate each collection
    let totalRecords = 0;
    let totalErrors = 0;

    for (const collection of targetCollections) {
      console.log(`\n📦 Processing: ${collection.name}`);
      console.log('─'.repeat(50));

      try {
        // Get full collection details
        const fullCollection = await localPb.collections.getOne(collection.id);
        const fields = fullCollection.fields || [];

        console.log(`  Fields: ${fields.length}`);
        fields.filter(f => !f.system).forEach(f => {
          console.log(`    - ${f.name} (${f.type})`);
        });

        // Check if collection exists on remote
        const remoteCollections = await remotePb.collections.getList(1, 500, {
          filter: `name = "${collection.name}"`,
          requestKey: null
        });

        // Delete existing collection if it exists
        if (remoteCollections.items.length > 0) {
          const remoteCol = remoteCollections.items[0];
          console.log(`  Deleting existing collection...`);

          try {
            await remotePb.collections.delete(remoteCol.id);
            console.log('  ✅ Deleted existing collection');
          } catch (delErr) {
            console.log(`  ⚠️  Could not delete: ${delErr.message}`);
            console.log('  Attempting to update fields instead...');

            try {
              await remotePb.collections.update(remoteCol.id, { fields });
              console.log('  ✅ Fields updated');

              const result = await migrateRecords(localPb, remotePb, collection.name, collection.name);
              totalRecords += result.success;
              totalErrors += result.failed;
              continue;
            } catch (updateErr) {
              console.log(`  ❌ Update failed: ${updateErr.message}`);
              continue;
            }
          }
        }

        // Create new collection with fields
        console.log(`  Creating collection with ${fields.length} fields...`);

        const newCollection = {
          name: fullCollection.name,
          type: fullCollection.type || 'base',
          fields: fields,
          listRule: '',
          viewRule: '',
          createRule: '',
          updateRule: '',
          deleteRule: ''
        };

        const created = await remotePb.collections.create(newCollection);
        console.log('  ✅ Collection created');

        // Migrate records
        const result = await migrateRecords(localPb, remotePb, created.name, collection.name);
        totalRecords += result.success;
        totalErrors += result.failed;

      } catch (err) {
        console.log(`  ❌ Error: ${err.message}`);
      }
    }

    // Summary
    console.log('\n' + '='.repeat(50));
    console.log('🎉 Migration Complete!');
    console.log('='.repeat(50));
    console.log(`   Total records migrated: ${totalRecords}`);
    console.log(`   Total errors: ${totalErrors}`);
    console.log('='.repeat(50));

  } catch (err) {
    console.error('\n❌ Migration failed:', err.message);
    if (err.response) {
      console.error('\nResponse details:');
      console.error(JSON.stringify(err.response, null, 2));
    }
  }
}

async function migrateRecords(localPb, remotePb, remoteCollectionName, localCollectionName) {
  try {
    const records = await localPb.collection(localCollectionName).getFullList({
      requestKey: null
    });

    console.log(`  Records: ${records.length}`);

    if (records.length === 0) {
      return { success: 0, failed: 0 };
    }

    let success = 0;
    let failed = 0;

    // Get existing records to check for duplicates
    const existingRecords = await remotePb.collection(remoteCollectionName).getFullList({
      requestKey: null
    });
    const existingData = new Map();
    existingRecords.forEach(r => {
      existingData.set(r.id, r);
    });

    for (const record of records) {
      try {
        // Extract only data fields (exclude system fields)
        const { id, created, updated, expand, collectionId, collectionName, ...data } = record;

        // Check if record already exists by comparing key fields
        const exists = existingRecords.some(r => {
          if (localCollectionName === 'egcsheet1_mstgrade' || localCollectionName === 'egcsheet1_mstitem' ||
              localCollectionName === 'egcsheet1_mstcmp' || localCollectionName === 'egcsheet1_mstmm' ||
              localCollectionName === 'egcsheet1_mstfit' || localCollectionName === 'egcsheet1_mstnali') {
            return r.name === data.name;
          }
          if (localCollectionName === 'egcsheet1_pktmst') {
            return r.pktno === data.pktno;
          }
          return false;
        });

        if (exists) {
          console.log(`    ⏭️  Skipped (already exists): ${data.name || data.pktno}`);
          success++;
          continue;
        }

        // Create clean data object without id (let remote generate new id)
        const createData = {};
        for (const [key, value] of Object.entries(data)) {
          if (value !== undefined && value !== null) {
            createData[key] = value;
          }
        }

        await remotePb.collection(remoteCollectionName).create(createData);
        success++;
      } catch (err) {
        failed++;
        console.log(`    ❌ ${record.id}: ${err.message.substring(0, 60)}`);
      }
    }

    console.log(`  ✅ Migrated: ${success}, Failed: ${failed}`);
    return { success, failed };

  } catch (err) {
    console.log(`  ❌ Error reading records: ${err.message}`);
    return { success: 0, failed: 0 };
  }
}

// Run the migration
migrate();
