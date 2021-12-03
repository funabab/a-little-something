import express from 'express'
import {
  addNews,
  addNewsComment,
  addNewsImage,
  deleteNews,
  deleteNewsImage,
  getNews,
  getNewsById,
  getNewsComments,
  getNewsImages,
  updateNews,
  updateNewsComment,
} from '../controllers/news'
import { body } from 'express-validator'
import { validateRequest } from '../utils'

const router = express.Router()

router
  .route('/')
  /***
   * @desc    Get all news
   * @route   GET /api/news/
   * @access  public
   */
  .get(getNews)
  /***
   * @desc    Add news
   * @route   POST /api/news/
   * @access  public
   */
  .post(
    body('author', 'author field is required').trim().exists({
      checkFalsy: true,
      checkNull: true,
    }),
    body('avatar', 'avatar field is required')
      .trim()
      .exists({
        checkFalsy: true,
        checkNull: true,
      })
      .isURL()
      .withMessage('avatar field should be a valid url'),
    body('title', 'title field is required').trim().exists({
      checkFalsy: true,
      checkNull: true,
    }),
    body('url', 'url field is required')
      .trim()
      .exists({
        checkFalsy: true,
        checkNull: true,
      })
      .isURL()
      .withMessage('url field should be a valid url'),
    validateRequest(),
    addNews
  )

router
  .route('/:id([a-z0-9-]+)')
  /***
   * @desc    Get news
   * @route   GET /api/news/:id
   * @access  public
   */
  .get(getNewsById)
  /***
   * @desc    Update news
   * @route   PUT /api/news/:id
   * @access  public
   */
  .put(
    body('author', 'author field is required').trim().exists({
      checkFalsy: true,
      checkNull: true,
    }),
    body('avatar', 'avatar field is required')
      .trim()
      .exists({
        checkFalsy: true,
        checkNull: true,
      })
      .isURL()
      .withMessage('avatar field should be a valid url'),
    body('title', 'title field is required').trim().exists({
      checkFalsy: true,
      checkNull: true,
    }),
    body('url', 'url field is required')
      .trim()
      .exists({
        checkFalsy: true,
        checkNull: true,
      })
      .isURL()
      .withMessage('url field should be a valid url'),
    validateRequest(),
    updateNews
  )
  /***
   * @desc    Delete news
   * @route   DELETE /api/news/:id
   * @access  public
   */
  .delete(deleteNews)

router
  .route('/:id([a-z0-9-]+)/images')
  /***
   * @desc    Get news images
   * @route   GET /api/news/:id/images
   * @access  public
   */
  .get(getNewsImages)
  /***
   * @desc    Add news images
   * @route   POST /api/news/:id/images
   * @access  public
   */
  .post(
    body('image', 'image field is required').trim().exists({
      checkFalsy: true,
      checkNull: true,
    }),
    validateRequest(),
    addNewsImage
  )

/***
 * @desc    Delete news images
 * @route   DELETE /api/news/:id/images/:imageId
 * @access  public
 */
router.delete('/:id([a-z0-9-]+)/images/:imageId([a-z0-9-]+)', deleteNewsImage)

router
  .route('/:id([a-z0-9-]+)/comments')
  /***
   * @desc    Get news comments
   * @route   DELETE /api/news/:id/comments/
   * @access  public
   */
  .get(getNewsComments)
  /***
   * @desc    Add news comment
   * @route   POST /api/news/:id/comments/
   * @access  public
   */
  .post(
    body('author', 'author field is required').trim().exists({
      checkFalsy: true,
      checkNull: true,
    }),
    body('name', 'name field is required')
      .trim()
      .exists({
        checkFalsy: true,
        checkNull: true,
      })
      .withMessage('name field should be a valid url'),
    body('avatar', 'url field is required')
      .trim()
      .exists({
        checkFalsy: true,
        checkNull: true,
      })
      .isURL()
      .withMessage('avatar field should be a valid url'),
    body('comment', 'comment field is required').trim().exists({
      checkFalsy: true,
      checkNull: true,
    }),
    validateRequest(),
    addNewsComment
  )

router
  .route('/:id([a-z0-9-]+)/comments/:commentId([a-z0-9-]+)')
  /***
   * @desc    Update news comment
   * @route   PUT /api/news/:id/comments/:commentId
   * @access  public
   */
  .put(
    body('author', 'author field is required').trim().exists({
      checkFalsy: true,
      checkNull: true,
    }),
    body('name', 'name field is required')
      .trim()
      .exists({
        checkFalsy: true,
        checkNull: true,
      })
      .withMessage('name field should be a valid url'),
    body('avatar', 'url field is required')
      .trim()
      .exists({
        checkFalsy: true,
        checkNull: true,
      })
      .isURL()
      .withMessage('avatar field should be a valid url'),
    body('comment', 'comment field is required').trim().exists({
      checkFalsy: true,
      checkNull: true,
    }),
    validateRequest(),
    updateNewsComment
  )

export default router
