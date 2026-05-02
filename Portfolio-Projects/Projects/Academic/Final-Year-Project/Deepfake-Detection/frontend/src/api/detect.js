import axios from 'axios';

/**
 * Send image + text to the Express proxy which forwards to FastAPI.
 * @param {File|null} imageFile
 * @param {string}    textContent
 * @returns {Promise<object>} API response data
 */
export async function runDetection(imageFile, textContent, documentFile) {
  const form = new FormData();
  if (imageFile)              form.append('file', imageFile);
  if (textContent?.trim())    form.append('text_content', textContent.trim());
  if (documentFile)           form.append('doc_file', documentFile);

  const { data } = await axios.post('/api/detect', form, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return data;
}

/**
 * Fetch scan history from Express/MongoDB.
 */
export async function getHistory() {
  const { data } = await axios.get('/api/history');
  return data;
}

/**
 * Delete a single scan record by id.
 */
export async function deleteHistoryItem(id) {
  await axios.delete(`/api/history/${id}`);
}
