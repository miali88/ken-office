/**
 * Common utility functions
 */

import { OfficeHost } from './types';

/**
 * Detect the current Office host application
 */
export function detectOfficeHost(): OfficeHost {
  if (typeof Office === 'undefined' || !Office.context) {
    return OfficeHost.Unknown;
  }

  const host = Office.context.host;

  if (host === Office.HostType.Word) {
    return OfficeHost.Word;
  } else if (host === Office.HostType.Outlook) {
    return OfficeHost.Outlook;
  }

  return OfficeHost.Unknown;
}

/**
 * Show/hide elements by ID
 */
export function showElement(elementId: string): void {
  const element = document.getElementById(elementId);
  if (element) {
    element.style.display = 'block';
  }
}

export function hideElement(elementId: string): void {
  const element = document.getElementById(elementId);
  if (element) {
    element.style.display = 'none';
  }
}

/**
 * Set element text content safely
 */
export function setTextContent(elementId: string, text: string): void {
  const element = document.getElementById(elementId);
  if (element) {
    element.textContent = text;
  }
}

/**
 * Set element HTML content safely
 */
export function setHtmlContent(elementId: string, html: string): void {
  const element = document.getElementById(elementId);
  if (element) {
    element.innerHTML = html;
  }
}

/**
 * Add event listener safely
 */
export function addClickHandler(
  elementId: string,
  handler: (event: MouseEvent) => void
): void {
  const element = document.getElementById(elementId);
  if (element) {
    element.addEventListener('click', handler);
  }
}

/**
 * Log with timestamp and context
 */
export function log(context: string, message: string, data?: any): void {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] [${context}]`, message, data || '');
}

/**
 * Error logging
 */
export function logError(context: string, error: Error | string): void {
  const timestamp = new Date().toISOString();
  const errorMessage = error instanceof Error ? error.message : error;
  console.error(`[${timestamp}] [${context}] ERROR:`, errorMessage);
  if (error instanceof Error && error.stack) {
    console.error(error.stack);
  }
}

/**
 * Safely parse JSON
 */
export function safeJsonParse<T>(json: string, fallback: T): T {
  try {
    return JSON.parse(json) as T;
  } catch (error) {
    logError('JSON Parse', error as Error);
    return fallback;
  }
}

/**
 * Delay/sleep utility
 */
export function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}
