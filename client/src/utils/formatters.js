/**
 * Formats an ISO date string into a human-readable date and time.
 * Gracefully handles null, undefined, and invalid values without showing "Invalid Date".
 * 
 * @param {string|Date|null} dateInput 
 * @param {boolean} includeTime 
 * @returns {string} Formatted string or '—'
 */
export function formatDate(dateInput, includeTime = true) {
  if (!dateInput) return '—';

  const date = new Date(dateInput);
  if (isNaN(date.getTime())) return '—';

  try {
    const options = {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      ...(includeTime
        ? {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true,
          }
        : {}),
    };
    return new Intl.DateTimeFormat('en-US', options).format(date);
  } catch {
    return '—';
  }
}

/**
 * Formats numeric weight in kilograms.
 * 
 * @param {number|string|null} weight 
 * @returns {string} e.g. "2.5 kg" or '—'
 */
export function formatWeight(weight) {
  if (weight === undefined || weight === null || weight === '') return '—';
  const num = Number(weight);
  if (isNaN(num) || num <= 0) return '—';
  return `${num.toFixed(1)} kg`;
}

/**
 * Copies text to clipboard with fallback when navigator.clipboard is restricted.
 * 
 * @param {string} text 
 * @returns {Promise<boolean>} True if copy succeeded
 */
export async function copyToClipboard(text) {
  if (!text) return false;

  // Modern navigator.clipboard API
  if (navigator?.clipboard?.writeText) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch {
      // Fallback if permission denied
    }
  }

  // Fallback using textarea + execCommand
  try {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-9999px';
    textArea.style.top = '0';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    const successful = document.execCommand('copy');
    document.body.removeChild(textArea);
    return successful;
  } catch {
    return false;
  }
}
