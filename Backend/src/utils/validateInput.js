exports.validateMovieInput = (data) => {
  const errors = [];

  if (!data.title) errors.push('Title is required');
  if (!data.description) errors.push('Description is required');
  if (!data.streamUrl) errors.push('Stream URL is required');
  if (!data.duration) errors.push('Duration is required');
  if (!data.price) errors.push('Price is required');
  if (!data.genre || !Array.isArray(data.genre)) errors.push('Genre must be an array');

  if (errors.length > 0) {
    throw new Error(errors.join(', '));
  }

  return data;
};
