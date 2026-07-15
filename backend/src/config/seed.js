import bcrypt from 'bcryptjs';
import prisma from './db.js';

const seed = async () => {
  console.log('Seeding database...');
  try {
    // Clear existing projects & admin
    await prisma.project.deleteMany({});
    await prisma.admin.deleteMany({});

    // Create Admin
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash('admin123', salt);
    const admin = await prisma.admin.create({
      data: {
        username: 'admin',
        passwordHash
      }
    });
    console.log('Admin user seeded:', admin.username);

    // Create Sample Projects
    const projects = [
      {
        title: 'LancerFlow - Freelance Platform',
        description: 'A premium system for project bids, dispute handling, and direct invoicing designed for developers.',
        imageUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&auto=format&fit=crop&q=60',
        githubUrl: 'https://github.com',
        liveUrl: 'https://example.com',
        tags: 'Next.js, TailwindCSS, PostgreSQL',
        order: 1
      },
      {
        title: 'Apex Dashboard UI',
        description: 'Clean analytics surface designed for fast scanning, repeated workflows, and heavy data viz loads.',
        imageUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&auto=format&fit=crop&q=60',
        githubUrl: 'https://github.com',
        liveUrl: 'https://example.com',
        tags: 'React, Vite, D3.js, Tailwind v4',
        order: 2
      },
      {
        title: 'Zenith Brand Portal',
        description: 'Premium headless Shopify web presence combining high web vitals, a fluid WebGL hero, and fully responsive layouts.',
        imageUrl: 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=600&auto=format&fit=crop&q=60',
        githubUrl: 'https://github.com',
        liveUrl: 'https://example.com',
        tags: 'Next.js, Shopify Storefront API, Three.js',
        order: 3
      }
    ];

    for (const project of projects) {
      const created = await prisma.project.create({ data: project });
      console.log('Project seeded:', created.title);
    }

    console.log('Seeding completed successfully!');
  } catch (error) {
    console.error('Error during seeding:', error);
  } finally {
    await prisma.$disconnect();
  }
};

seed();
