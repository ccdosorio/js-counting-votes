const { Router } = require('express');

const {
    politicGet,
    politicShortGet,
    politicPost,
    politicDelete
} = require('../controllers/politicparty');

const router = Router();

router.get('/', politicGet);
router.get('/short', politicShortGet);
router.post('/', politicPost);
router.post('/delete/:id', politicDelete);

module.exports = router;