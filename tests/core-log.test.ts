import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Logger, LogLevel, logger, createLogger } from '../packages/core/src/log';

describe('Logger', () => {
  // 在每个测试前重新模拟console方法
  let consoleDebugMock: vi.SpyInstance;
  let consoleInfoMock: vi.SpyInstance;
  let consoleWarnMock: vi.SpyInstance;
  let consoleErrorMock: vi.SpyInstance;

  beforeEach(() => {
    // 模拟console方法
    consoleDebugMock = vi.spyOn(console, 'debug').mockImplementation(() => {});
    consoleInfoMock = vi.spyOn(console, 'info').mockImplementation(() => {});
    consoleWarnMock = vi.spyOn(console, 'warn').mockImplementation(() => {});
    consoleErrorMock = vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    // 恢复原始console方法
    consoleDebugMock.mockRestore();
    consoleInfoMock.mockRestore();
    consoleWarnMock.mockRestore();
    consoleErrorMock.mockRestore();
  });

  it('应该正确创建Logger实例', () => {
    const logger = new Logger('test-module');
    expect(logger).toBeInstanceOf(Logger);
  });

  it('应该使用默认配置', () => {
    const logger = new Logger('test-module');
    // 测试默认配置下的日志输出
    logger.info('test message');
    expect(consoleInfoMock).toHaveBeenCalled();
  });

  it('应该支持自定义配置', () => {
    const logger = new Logger('test-module', {
      level: LogLevel.DEBUG,
      showTimestamp: false,
    });

    logger.debug('debug message');
    expect(consoleDebugMock).toHaveBeenCalled();
    // 检查日志消息是否不包含ISO格式的时间戳
    expect(consoleDebugMock).toHaveBeenCalledWith(
      expect.not.stringMatching(/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z/),
      'debug message',
    );
  });

  it('应该根据日志级别过滤日志', () => {
    const logger = new Logger('test-module', {
      level: LogLevel.WARN,
    });

    logger.debug('debug message');
    logger.info('info message');
    logger.warn('warn message');
    logger.error('error message');

    expect(consoleDebugMock).not.toHaveBeenCalled();
    expect(consoleInfoMock).not.toHaveBeenCalled();
    expect(consoleWarnMock).toHaveBeenCalled();
    expect(consoleErrorMock).toHaveBeenCalled();
  });

  it('应该支持更新配置', () => {
    const logger = new Logger('test-module', {
      level: LogLevel.ERROR,
    });

    logger.warn('warn message');
    expect(consoleWarnMock).not.toHaveBeenCalled();

    // 更新配置
    logger.updateConfig({ level: LogLevel.WARN });

    logger.warn('warn message');
    expect(consoleWarnMock).toHaveBeenCalled();
  });

  it('应该支持禁用日志', () => {
    const logger = new Logger('test-module', {
      enabled: false,
    });

    logger.error('error message');
    expect(consoleErrorMock).not.toHaveBeenCalled();
  });

  it('应该正确格式化日志消息', () => {
    const logger = new Logger('test-module', {
      showTimestamp: true,
      showModuleName: true,
    });

    logger.info('test message');
    expect(consoleInfoMock).toHaveBeenCalledWith(expect.stringContaining('[INFO]'), 'test message');
    expect(consoleInfoMock).toHaveBeenCalledWith(
      expect.stringContaining('[test-module]'),
      'test message',
    );
  });

  it('应该支持log方法', () => {
    const logger = new Logger('test-module');

    logger.log(LogLevel.INFO, 'test message');
    expect(consoleInfoMock).toHaveBeenCalled();

    logger.log(LogLevel.ERROR, 'error message');
    expect(consoleErrorMock).toHaveBeenCalled();
  });
});

describe('Default Logger', () => {
  let consoleInfoMock: vi.SpyInstance;

  beforeEach(() => {
    consoleInfoMock = vi.spyOn(console, 'info').mockImplementation(() => {});
  });

  afterEach(() => {
    consoleInfoMock.mockRestore();
  });

  it('应该导出默认logger实例', () => {
    expect(logger).toBeInstanceOf(Logger);
  });

  it('应该可以直接使用默认logger', () => {
    logger.info('test message');
    expect(consoleInfoMock).toHaveBeenCalled();
  });
});

describe('createLogger', () => {
  let consoleDebugMock: vi.SpyInstance;

  beforeEach(() => {
    consoleDebugMock = vi.spyOn(console, 'debug').mockImplementation(() => {});
  });
  afterEach(() => {
    consoleDebugMock.mockRestore();
  });

  it('应该创建新的logger实例', () => {
    const customLogger = createLogger('custom-module');
    expect(customLogger).toBeInstanceOf(Logger);
    expect(customLogger).not.toBe(logger); // 应该是不同的实例
  });

  it('应该支持自定义配置', () => {
    const customLogger = createLogger('custom-module', {
      level: LogLevel.DEBUG,
    });

    customLogger.debug('debug message');
    expect(consoleDebugMock).toHaveBeenCalled();
  });
});
