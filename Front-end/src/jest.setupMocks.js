jest.mock('@tensorflow-models/coco-ssd', () => ({
    __esModule: true,
    default: {
      load: async () => ({
        detect: async () => [
          { class: 'bottle', bbox: [0, 0, 100, 100], score: 0.9 }
        ],
      }),
    },
  }));
  
  jest.mock('@tensorflow/tfjs', () => ({}));
  