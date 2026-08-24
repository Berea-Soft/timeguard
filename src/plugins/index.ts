/**
 * TimeGuard Plugins
 * Central export point for all plugins
 */

export { PluginManager } from './manager';
export {
  RelativeTimePlugin,
  default as relativeTimePlugin,
} from './relative-time';
export {
  DurationPlugin,
  Duration,
  default as durationPlugin,
} from './duration';
export {
  AdvancedFormatPlugin,
  default as advancedFormatPlugin,
} from './advanced-format';

// Re-export types
export type {
  RelativeTimeConfig,
  RelativeTimeFormats,
  RelativeTimeThreshold,
} from './relative-time/types';
export type {
  IDuration,
  DurationInput,
  DurationObject,
  DurationUnit,
} from './duration/types';
