class TestUtils {
  static mockPartial<T>(defaults: Partial<T> = {}): T {
    return <T>defaults;
  }
}

export default TestUtils;
