/**
 * 日志级别枚举
 */
export enum LogLevel {
  DEBUG = 'debug',
  INFO = 'info',
  WARN = 'warn',
  ERROR = 'error',
  NONE = 'none'
}

/**
 * 日志配置接口
 */
export interface LogConfig {
  /** 日志级别，低于此级别的日志不会被输出 */
  level: LogLevel;
  /** 是否启用日志 */
  enabled: boolean;
  /** 是否在日志中包含时间戳 */
  showTimestamp: boolean;
  /** 是否在日志中包含模块名称 */
  showModuleName: boolean;
}

/**
 * 默认日志配置
 */
const DEFAULT_LOG_CONFIG: LogConfig = {
  level: LogLevel.INFO,
  enabled: true,
  showTimestamp: true,
  showModuleName: true
};

/**
 * 日志级别优先级映射
 */
const LOG_LEVEL_PRIORITY: Record<LogLevel, number> = {
  [LogLevel.DEBUG]: 0,
  [LogLevel.INFO]: 1,
  [LogLevel.WARN]: 2,
  [LogLevel.ERROR]: 3,
  [LogLevel.NONE]: 4
};

/**
 * 日志类
 */
export class Logger {
  private config: LogConfig;
  private moduleName: string;

  /**
   * 创建日志实例
   * @param moduleName 模块名称
   * @param config 日志配置
   */
  constructor(moduleName: string = 'core', config?: Partial<LogConfig>) {
    this.moduleName = moduleName;
    this.config = {
      ...DEFAULT_LOG_CONFIG,
      ...config
    };
  }

  /**
   * 更新日志配置
   * @param config 新的日志配置
   */
  updateConfig(config: Partial<LogConfig>): void {
    this.config = {
      ...this.config,
      ...config
    };
  }

  /**
   * 检查日志级别是否应该输出
   * @param level 要检查的日志级别
   * @returns 是否应该输出该级别的日志
   */
  private shouldLog(level: LogLevel): boolean {
    if (!this.config.enabled) {
      return false;
    }

    return LOG_LEVEL_PRIORITY[level] >= LOG_LEVEL_PRIORITY[this.config.level];
  }

  /**
   * 格式化日志消息
   * @param level 日志级别
   * @param args 日志参数
   * @returns 格式化后的日志消息
   */
  private formatMessage(level: LogLevel, ...args: any[]): string {
    const parts: string[] = [];

    if (this.config.showTimestamp) {
      const timestamp = new Date().toISOString();
      parts.push(`[${timestamp}]`);
    }

    parts.push(`[${level.toUpperCase()}]`);

    if (this.config.showModuleName) {
      parts.push(`[${this.moduleName}]`);
    }

    return [`${parts.join(' ')}`, ...args];
  }

  /**
   * 输出调试日志
   * @param args 日志参数
   */
  debug(...args: any[]): void {
    if (this.shouldLog(LogLevel.DEBUG)) {
      console.debug(...this.formatMessage(LogLevel.DEBUG, ...args));
    }
  }

  /**
   * 输出信息日志
   * @param args 日志参数
   */
  info(...args: any[]): void {
    if (this.shouldLog(LogLevel.INFO)) {
      console.info(...this.formatMessage(LogLevel.INFO, ...args));
    }
  }

  /**
   * 输出警告日志
   * @param args 日志参数
   */
  warn(...args: any[]): void {
    if (this.shouldLog(LogLevel.WARN)) {
      console.warn(...this.formatMessage(LogLevel.WARN, ...args));
    }
  }

  /**
   * 输出错误日志
   * @param args 日志参数
   */
  error(...args: any[]): void {
    if (this.shouldLog(LogLevel.ERROR)) {
      console.error(...this.formatMessage(LogLevel.ERROR, ...args));
    }
  }

  /**
   * 输出日志（不限制级别）
   * @param level 日志级别
   * @param args 日志参数
   */
  log(level: LogLevel, ...args: any[]): void {
    switch (level) {
      case LogLevel.DEBUG:
        this.debug(...args);
        break;
      case LogLevel.INFO:
        this.info(...args);
        break;
      case LogLevel.WARN:
        this.warn(...args);
        break;
      case LogLevel.ERROR:
        this.error(...args);
        break;
    }
  }
}

/**
 * 默认日志实例
 */
export const logger = new Logger('viewless-core');

/**
 * 创建新的日志实例
 * @param moduleName 模块名称
 * @param config 日志配置
 * @returns 新的日志实例
 */
export function createLogger(moduleName: string, config?: Partial<LogConfig>): Logger {
  return new Logger(moduleName, config);
}