const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, 'resumes.db');
const db = new sqlite3.Database(dbPath);

console.log('📊 Resume Database Information');
console.log('=============================');
console.log(`Database file: ${dbPath}`);
console.log('');

// Check if database exists and show table info
db.serialize(() => {
    // Check if resumes table exists
    db.get("SELECT name FROM sqlite_master WHERE type='table' AND name='resumes'", (err, row) => {
        if (err) {
            console.error('❌ Error checking database:', err.message);
        } else if (row) {
            console.log('✅ Database table "resumes" exists');
            
            // Show table structure
            db.all("PRAGMA table_info(resumes)", (err, rows) => {
                if (err) {
                    console.error('❌ Error getting table info:', err.message);
                } else {
                    console.log('\n📋 Table Structure:');
                    console.log('Column Name | Type | Not Null | Primary Key');
                    console.log('------------|------|----------|-------------');
                    rows.forEach(col => {
                        console.log(`${col.name.padEnd(11)} | ${col.type.padEnd(4)} | ${col.notnull ? 'Yes' : 'No'.padEnd(8)} | ${col.pk ? 'Yes' : 'No'}`);
                    });
                }
                
                // Count records
                db.get("SELECT COUNT(*) as count FROM resumes", (err, row) => {
                    if (err) {
                        console.error('❌ Error counting records:', err.message);
                    } else {
                        console.log(`\n📈 Total resumes stored: ${row.count}`);
                    }
                    
                    // Show recent resumes
                    db.all("SELECT id, name, created_at, updated_at FROM resumes ORDER BY updated_at DESC LIMIT 5", (err, rows) => {
                        if (err) {
                            console.error('❌ Error fetching recent resumes:', err.message);
                        } else if (rows.length > 0) {
                            console.log('\n📝 Recent Resumes:');
                            rows.forEach(resume => {
                                const date = new Date(resume.updated_at).toLocaleString();
                                console.log(`ID: ${resume.id} | Name: ${resume.name} | Updated: ${date}`);
                            });
                        } else {
                            console.log('\n📝 No resumes found in database');
                        }
                        
                        db.close();
                    });
                });
            });
        } else {
            console.log('❌ Database table "resumes" does not exist');
            console.log('💡 Run the server to initialize the database');
            db.close();
        }
    });
});

console.log('\n💡 Database Management Tips:');
console.log('• The database file is created automatically when you start the server');
console.log('• All resume data is stored securely in the SQLite database');
console.log('• The database file is located in your project root directory');
console.log('• You can backup the database by copying the resumes.db file');
console.log('• The database is automatically initialized when the server starts'); 