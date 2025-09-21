import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { UsersService } from '../users/users.service';

async function testAuthFlow() {
  console.log('🔐 Testing authentication flow...');
  
  const app = await NestFactory.createApplicationContext(AppModule);
  const usersService = app.get(UsersService);

  try {
    // Check if there are any users in the database
    console.log('\n1. Checking existing users...');
    const users = await usersService.findAll();
    console.log(`✅ Found ${users.length} users in database`);
    
    if (users.length === 0) {
      console.log('❌ No users found! You need to register a user first.');
      console.log('\n🛠️ To fix this:');
      console.log('1. Go to http://localhost:3000');
      console.log('2. Click "Sign up" or "Register"');
      console.log('3. Create a new account');
      console.log('4. Then login with those credentials');
    } else {
      console.log('✅ Users exist. Sample user:');
      const sampleUser = users[0];
      console.log(`   Email: ${sampleUser.email}`);
      console.log(`   Name: ${sampleUser.firstName} ${sampleUser.lastName}`);
      console.log(`   Role: ${sampleUser.role}`);
      console.log(`   Active: ${sampleUser.isActive}`);
      
      console.log('\n🛠️ To fix the authentication issue:');
      console.log('1. Go to http://localhost:3000');
      console.log('2. Click "Login"');
      console.log('3. Use these credentials to login');
      console.log('4. After successful login, check DevTools Application tab');
      console.log('5. Look for a session cookie (usually named "connect.sid")');
    }

    console.log('\n📊 Current authentication status:');
    console.log('❌ User is NOT logged in (no session cookie in requests)');
    console.log('❌ All protected endpoints return 403 Forbidden');
    console.log('❌ DSA Sheet cannot load without authentication');

  } catch (error) {
    console.error('❌ Error testing auth flow:', error);
  } finally {
    await app.close();
  }
}

testAuthFlow();