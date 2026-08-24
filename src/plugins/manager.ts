/**
 * TimeGuard Plugin Manager
 * Singleton pattern for managing plugin registration and lifecycle
 * Follows SOLID principles - Single Responsibility & Dependency Inversion
 */

import type { ITimeGuardPlugin } from '../types';
import type { TimeGuard } from '../index';

interface PluginEntry {
  plugin: ITimeGuardPlugin;
  timeGuardClass: typeof TimeGuard;
}

/**
 * Plugin Manager - handles plugin registration and initialization
 * Uses Singleton pattern to ensure single instance across application
 */
export class PluginManager {
  private static instance: PluginManager;
  private plugins: Map<string, PluginEntry> = new Map();

  /**
   * Get singleton instance
   */
  static getInstance(): PluginManager {
    if (!PluginManager.instance) {
      PluginManager.instance = new PluginManager();
    }
    return PluginManager.instance;
  }

  /**
   * Register a plugin
   * @param plugin - The plugin to register
   * @param timeGuardClass - Reference to TimeGuard class
   * @param config - Optional plugin configuration
   */
  static use(
    plugin: ITimeGuardPlugin,
    timeGuardClass: typeof TimeGuard,
    config?: unknown,
  ): void {
    const manager = PluginManager.getInstance();
    manager.register(plugin, timeGuardClass, config);
  }

  /**
   * Register multiple plugins at once
   * @param plugins - Array of plugins to register
   * @param timeGuardClass - Reference to TimeGuard class
   * @param config - Optional plugin configuration
   */
  static useMultiple(
    plugins: ITimeGuardPlugin[],
    timeGuardClass: typeof TimeGuard,
    config?: unknown,
  ): void {
    const manager = PluginManager.getInstance();
    plugins.forEach((plugin) =>
      manager.register(plugin, timeGuardClass, config),
    );
  }

  /**
   * Get registered plugin by name
   * @param name - Plugin name
   * @returns Plugin instance or undefined
   */
  static getPlugin(name: string): ITimeGuardPlugin | undefined {
    const manager = PluginManager.getInstance();
    return manager.plugins.get(name)?.plugin;
  }

  /**
   * Check if plugin is registered
   * @param name - Plugin name
   * @returns True if plugin is registered
   */
  static hasPlugin(name: string): boolean {
    const manager = PluginManager.getInstance();
    return manager.plugins.has(name);
  }

  /**
   * Get all registered plugins
   * @returns Array of registered plugin names
   */
  static listPlugins(): string[] {
    const manager = PluginManager.getInstance();
    return Array.from(manager.plugins.keys());
  }

  /**
   * Unregister a plugin — calls its uninstall() hook (if implemented) to
   * reverse whatever install() did, so re-registering the same plugin
   * later starts from a clean prototype instead of stacking a new patch
   * on top of the old one.
   * @param name - Plugin name
   */
  static unuse(name: string): boolean {
    const manager = PluginManager.getInstance();
    const entry = manager.plugins.get(name);
    if (!entry) {
      return false;
    }
    entry.plugin.uninstall?.(entry.timeGuardClass);
    return manager.plugins.delete(name);
  }

  /**
   * Clear all plugins — calls each one's uninstall() hook (if implemented)
   * before forgetting it, for the same reason as unuse().
   */
  static clear(): void {
    const manager = PluginManager.getInstance();
    for (const entry of manager.plugins.values()) {
      entry.plugin.uninstall?.(entry.timeGuardClass);
    }
    manager.plugins.clear();
  }

  /**
   * Internal register method
   */
  private register(
    plugin: ITimeGuardPlugin,
    timeGuardClass: typeof TimeGuard,
    config?: unknown,
  ): void {
    if (this.plugins.has(plugin.name)) {
      console.warn(
        `Plugin "${plugin.name}" is already registered. Skipping...`,
      );
      return;
    }

    try {
      plugin.install(timeGuardClass, config);
      this.plugins.set(plugin.name, { plugin, timeGuardClass });
      if (process.env.NODE_ENV !== 'production') {
        console.warn(
          `Plugin "${plugin.name}" v${plugin.version} registered successfully`,
        );
      }
    } catch (error) {
      console.error(`Failed to register plugin "${plugin.name}":`, error);
      throw new Error(
        `Failed to register plugin "${plugin.name}": ${error instanceof Error ? error.message : String(error)}`,
      );
    }
  }
}
