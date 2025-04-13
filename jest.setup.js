Object.defineProperty(window.URL, 'createObjectURL', {
    writable: true,
    value: jest.fn(),
});