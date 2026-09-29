import swaggerAutogen from 'swagger-autogen';

const doc = {
  info: { title: 'Review Kantin API', version: '1.0.0' },
  servers: [{ url: 'http://localhost:3000' }],

  definitions: {
    StallInput: {
      $ownerId: 2,
      $name: 'Warung Baru',
      category: 'Nasi',
      location: 'Kantin FK',
      description: '',
    },

    UserInput: {
      $name: 'Budi Santoso',
      $email: 'budi@student.test',
      $password: 'rahasia123',
      role: 'customer',
    },

    MenuItemInput: {
      $stallId: 1,
      $name: 'Menu Baru',
      $price: 10000,
      isAvailable: true,
    },

    ReviewInput: {
      $stallId: 1,
      $userId: 1,
      $rating: 5,
      comment: 'Makanannya enak dan pelayanannya cepat',
    },

    LikeInput: {
      $reviewId: 1,
      $userId: 1,
    },

    FlagUpdateInput: {
      $status: 'pending',
    },

    AuditInput: {
      $userId: 1,
      $action: 'CREATE',
      $targetTable: 'stalls',
      $targetId: 1,
      $metadata: {},
    },
  },
};

const outputFile = './swagger-output.json';
const endpointsFiles = ['./src/index.ts'];

swaggerAutogen()(outputFile, endpointsFiles, doc);
