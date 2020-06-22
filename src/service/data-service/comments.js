const { nanoid } = require(`nanoid`);
const { MAX_ID_LENGTH } = require(`../constants`);

class CommentsService {
  findAll(offer) {
    return offer.comments;
  }

  create(offer, comment) {
    const newComment = {
      id: nanoid(MAX_ID_LENGTH),
      ...comment,
    };

    offer.comments.push(newComment);
    return newComment;
  }

  drop(offer, commentId) {
    const droppedComment = offer.comments.find((item) => item.id === commentId);

    if (!droppedComment) {
      return null;
    }

    offer.comments = offer.comments.filter((item) => item.id !== commentId);

    return droppedComment;
  }
}

module.exports = CommentsService;
