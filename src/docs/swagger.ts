import swaggerAutogen from 'swagger-autogen';

const doc = {
  info: { title: 'Review Kantin API', version: '1.0.0' },
  servers: [{ url: 'http://localhost:3000' }],

  // Konfigurasi autentikasi JWT
  securityDefinitions: {
    BearerAuth: {
      type: 'apiKey',
      name: 'Authorization',
      in: 'header',
      description:
        'Isi dengan: Bearer <token>  (tulis kata Bearer, satu spasi, lalu token)',
    },
  },

  definitions: {
    StallInput: {
      $name: 'Warung Baru',
      category: 'Nasi',
      location: 'Kantin FK',
      description: '',
    },

    UserInput: {
      $name: 'Budi Santoso',
      $email: 'budi@student.test',
      $password: 'rahasia123',
    },

    MenuItemInput: {
      $stallId: 1,
      $name: 'Menu Baru',
      $price: 10000,
      isAvailable: true,
    },

    ReviewInput: {
      $rating: 5,
      comment: 'Makanannya enak dan pelayanannya cepat',
    },

    LikeInput: {
      $reviewId: 1,
    },

    FlagUpdateInput: {
      $status: 'pending',
    },

    AuditInput: {
      $action: 'CREATE',
      $targetTable: 'stalls',
      $targetId: 1,
      metadata: {},
    },
  },
};

const outputFile = './swagger-output.json';
const endpointsFiles = ['./src/index.ts'];

swaggerAutogen()(outputFile, endpointsFiles, doc);