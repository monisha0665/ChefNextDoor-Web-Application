import { downloadGraphicAsPNG, downloadImageUrl } from '../../lib/downloadHelper';

describe('downloadHelper utility', () => {
  beforeEach(() => {
    const mockGetContext = jest.fn(() => ({
      createLinearGradient: jest.fn(() => ({
        addColorStop: jest.fn(),
      })),
      beginPath: jest.fn(),
      arc: jest.fn(),
      fill: jest.fn(),
      fillRect: jest.fn(),
      fillText: jest.fn(),
      drawImage: jest.fn(),
    }));

    const mockToDataURL = jest.fn(() => 'data:image/png;base64,mock');

    // Mock DOM elements
    const originalCreateElement = document.createElement.bind(document);
    document.createElement = jest.fn().mockImplementation((tagName) => {
      if (tagName === 'canvas') {
        return {
          width: 800,
          height: 800,
          getContext: mockGetContext,
          toDataURL: mockToDataURL,
        };
      }
      if (tagName === 'a') {
        return {
          click: jest.fn(),
          href: '',
          download: '',
        };
      }
      return originalCreateElement(tagName);
    });

    document.body.appendChild = jest.fn();
    document.body.removeChild = jest.fn();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('downloadGraphicAsPNG', () => {
    it('should create canvas, render graphic, and trigger download', () => {
      downloadGraphicAsPNG({ filename: 'test.png', isCircle: true });
      expect(document.createElement).toHaveBeenCalledWith('canvas');
      expect(document.body.appendChild).toHaveBeenCalled();
      expect(document.body.removeChild).toHaveBeenCalled();
    });

    it('should render square graphic and trigger download', () => {
      downloadGraphicAsPNG({ filename: 'test-square.png', isCircle: false, subtitle: 'subtitle' });
      expect(document.createElement).toHaveBeenCalledWith('canvas');
    });
  });

  describe('downloadImageUrl', () => {
    it('should trigger direct download using fetch', async () => {
      global.fetch = jest.fn().mockResolvedValue({
        ok: true,
        blob: jest.fn().mockResolvedValue(new Blob(['test'])),
      });
      global.URL.createObjectURL = jest.fn().mockReturnValue('blob:test');
      global.URL.revokeObjectURL = jest.fn();

      await downloadImageUrl('http://example.com/image.jpg', 'image.jpg');

      expect(global.fetch).toHaveBeenCalledWith('http://example.com/image.jpg');
      expect(document.body.appendChild).toHaveBeenCalled();
    });
  });
});
