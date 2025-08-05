#!/usr/bin/env node

/**
 * Deployment Test Script
 * Tests basic functionality to ensure deployment readiness
 */

const fs = require('fs');
const path = require('path');

console.log('🧪 Testing Deployment Configuration...\n');

// Test 1: Check package.json
console.log('1. Checking package.json...');
try {
    const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
    
    const requiredFields = ['name', 'version', 'main', 'scripts', 'dependencies'];
    const missingFields = requiredFields.filter(field => !packageJson[field]);
    
    if (missingFields.length > 0) {
        console.log('❌ Missing required fields:', missingFields);
    } else {
        console.log('✅ package.json is valid');
    }
    
    // Check Node.js version requirement
    if (packageJson.engines && packageJson.engines.node) {
        console.log(`✅ Node.js version requirement: ${packageJson.engines.node}`);
    }
    
} catch (error) {
    console.log('❌ Error reading package.json:', error.message);
}

// Test 2: Check server.js exists
console.log('\n2. Checking server.js...');
if (fs.existsSync('server.js')) {
    console.log('✅ server.js exists');
} else {
    console.log('❌ server.js not found');
}

// Test 3: Check public directory
console.log('\n3. Checking public directory...');
if (fs.existsSync('public')) {
    console.log('✅ public directory exists');
    
    if (fs.existsSync('public/index.html')) {
        console.log('✅ index.html exists');
    } else {
        console.log('❌ index.html not found');
    }
} else {
    console.log('❌ public directory not found');
}

// Test 4: Check Procfile (for Heroku)
console.log('\n4. Checking Procfile...');
if (fs.existsSync('Procfile')) {
    console.log('✅ Procfile exists');
    const procfileContent = fs.readFileSync('Procfile', 'utf8');
    if (procfileContent.includes('web: node server.js')) {
        console.log('✅ Procfile content is correct');
    } else {
        console.log('❌ Procfile content is incorrect');
    }
} else {
    console.log('⚠️  Procfile not found (optional for Heroku)');
}

// Test 5: Check .gitignore
console.log('\n5. Checking .gitignore...');
if (fs.existsSync('.gitignore')) {
    console.log('✅ .gitignore exists');
    
    const gitignoreContent = fs.readFileSync('.gitignore', 'utf8');
    const importantEntries = ['node_modules/', '*.db', 'uploads/', '.env'];
    const missingEntries = importantEntries.filter(entry => !gitignoreContent.includes(entry));
    
    if (missingEntries.length > 0) {
        console.log('⚠️  Missing important entries:', missingEntries);
    } else {
        console.log('✅ .gitignore includes important entries');
    }
} else {
    console.log('❌ .gitignore not found');
}

// Test 6: Check dependencies
console.log('\n6. Checking dependencies...');
try {
    const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
    const requiredDeps = ['express', 'puppeteer', 'sqlite3'];
    const missingDeps = requiredDeps.filter(dep => !packageJson.dependencies[dep]);
    
    if (missingDeps.length > 0) {
        console.log('❌ Missing required dependencies:', missingDeps);
    } else {
        console.log('✅ All required dependencies are listed');
    }
} catch (error) {
    console.log('❌ Error checking dependencies:', error.message);
}

// Test 7: Check for deployment files
console.log('\n7. Checking deployment files...');
const deploymentFiles = ['DEPLOYMENT.md', 'README.md'];
deploymentFiles.forEach(file => {
    if (fs.existsSync(file)) {
        console.log(`✅ ${file} exists`);
    } else {
        console.log(`❌ ${file} not found`);
    }
});

// Test 8: Check uploads directory
console.log('\n8. Checking uploads directory...');
if (fs.existsSync('uploads')) {
    console.log('✅ uploads directory exists');
} else {
    console.log('⚠️  uploads directory not found (will be created automatically)');
}

console.log('\n🎯 Deployment Test Summary:');
console.log('If you see mostly ✅ marks, your project is ready for deployment!');
console.log('If you see ❌ marks, please fix those issues before deploying.');
console.log('\n📚 For detailed deployment instructions, see DEPLOYMENT.md');
console.log('🚀 Happy deploying!'); 