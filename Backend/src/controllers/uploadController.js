const Movie = require('../models/Movie');
const ipfsService = require('../services/ipfsService');
const { AppError } = require('../middlewares/errorHandler');

exports.uploadMovie = async (req, res, next) => {
  try {
    const { title, description, hasVR } = req.body;
    const { video, poster, vrVideo } = req.files;

    if (!video || !poster) {
      throw new AppError('Video and poster are required', 400);
    }

     const [videoUrl, posterUrl] = await Promise.all([
      ipfsService.uploadFile(video.buffer, `${title}-video`),
      ipfsService.uploadFile(poster.buffer, `${title}-poster`)
    ]);

    let vrStreamUrl = null;
    if (hasVR && vrVideo) {
      vrStreamUrl = await ipfsService.uploadFile(
        vrVideo.buffer, 
        `${title}-vr-video`
      );
    }

     const movie = await Movie.create({
      title,
      description,
      hasVR: Boolean(hasVR),
      streamUrl: videoUrl,
      vrStreamUrl,
      poster: posterUrl,
      uploadedBy: req.user.id
    });

    res.status(201).json({
      success: true,
      data: movie
    });
  } catch (error) {
    next(error);
  }
};

exports.updateMovieFiles = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { video, vrVideo } = req.files;

    const movie = await Movie.findById(id);
    if (!movie) {
      throw new AppError('Movie not found', 404);
    }

     if (video) {
      const videoResult = await ipfs.add(video.buffer);
      movie.streamUrl = `ipfs://${videoResult.path}`;
    }

    if (vrVideo) {
      const vrResult = await ipfs.add(vrVideo.buffer);
      movie.vrStreamUrl = `ipfs://${vrResult.path}`;
      movie.hasVR = true;
    }

    await movie.save();

    res.json({
      success: true,
      data: movie
    });
  } catch (error) {
    next(error);
  }
}; 