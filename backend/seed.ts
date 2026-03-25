import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { User } from './src/models/User';
import { hashPassword } from './src/services/auth.service';

dotenv.config();

const seedData = async () => {
  try {
    const mongoURI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/reputechain';
    await mongoose.connect(mongoURI);
    console.log('MongoDB connected for seeding...');

    // Clear existing user with the same email if desired, or just find it
    const email = 'hariom@example.com';
    let user = await User.findOne({ email });

    const githubUsername = 'Harry1824';
    const linkedinProfile = 'https://www.linkedin.com/in/hariom-kumar-352604291';
    const stackoverflowProfile = 'https://stackoverflow.com/users/9999999/hariom-kumar'; // Added from my side

    if (!user) {
      console.log('Creating new user Hariom...');
      const hashedPassword = await hashPassword('SecurePassword123!');
      user = await User.create({
        name: 'Hariom Kumar',
        email,
        password: hashedPassword,
        githubUsername,
        linkedinProfile,
        stackoverflowProfile,
        walletAddress: '0x1234567890abcdef1234567890abcdef12345678' // mock wallet
      });
      console.log('User Hariom created successfully!');
    } else {
      console.log('User Hariom already exists. Updating profiles...');
      user.githubUsername = githubUsername;
      user.linkedinProfile = linkedinProfile;
      user.stackoverflowProfile = stackoverflowProfile;
      await user.save();
      console.log('User profiles updated successfully!');
    }

    console.log('Seed completed successfully!');
    console.log(`Email: ${email}`);
    console.log(`Password: SecurePassword123!`);
    console.log('You can now log in with these credentials or test the reputation calculation endpoint for this user.');
    process.exit(0);
  } catch (error) {
    console.error('Error during seeding:', error);
    process.exit(1);
  }
};

seedData();
