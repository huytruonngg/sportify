import express from 'express';
import expressAsyncHandler from 'express-async-handler';
import Event from '../models/eventModel.js';
import { isAuth, isAdmin } from '../utils.js';

const eventRouter = express.Router();

eventRouter.get('/', async (req, res) => {
  const events = await Event.find();
  res.send(events);
});

eventRouter.post(
  '/',
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const newEvent = new Event({
      name: 'sample name ' + Date.now(),
      slug: 'sample-name-' + Date.now(),
      image: '/images/p1.jpg',
      participants: 0,
      category: 'sample category',
      description: 'sample description',
      location: "sample location",
      dayAndTime: 'sample day and time',

    });
    const event = await newEvent.save();
    res.send({ message: 'Event Created', event });
  })
);

eventRouter.put(
  '/:id',
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const eventId = req.params.id;
    const event = await Event.findById(eventId);
    if (event) {
      event.name = req.body.name;
      event.slug = req.body.slug;
      event.participants = req.body.participants;
      event.image = req.body.image;
      event.category = req.body.category;
      event.location = req.body.location;
      event.dayAndTime = req.body.dayAndTime;
      event.description = req.body.description;
      await event.save();
      res.send({ message: 'Event Updated' });
    } else {
      res.status(404).send({ message: 'Event Not Found' });
    }
  })
);

eventRouter.delete(
  '/:id',
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const event = await Event.findById(req.params.id);
    if (event) {
      await event.remove();
      res.send({ message: 'Event Deleted' });
    } else {
      res.status(404).send({ message: 'Event Not Found' });
    }
  })
);

const PAGE_SIZE = 3;
eventRouter.get(
  '/admin',
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const { query } = req;
    const page = query.page || 1;
    const pageSize = query.pageSize || PAGE_SIZE;

    const events = await Event.find()
      .skip(pageSize * (page - 1))
      .limit(pageSize);
    const countEvents = await Event.countDocuments();
    res.send({
      events,
      countEvents,
      page,
      pages: Math.ceil(countEvents / pageSize),
    });
  })
);

eventRouter.get(
  '/search',
  expressAsyncHandler(async (req, res) => {
    const { query } = req;
    const pageSize = query.pageSize || PAGE_SIZE;
    const page = query.page || 1;
    const category = query.category || '';
    const searchQuery = query.query || '';

    const queryFilter =
      searchQuery && searchQuery !== 'all'
        ? {
            name: {
              $regex: searchQuery,
              $options: 'i',
            },
          }
        : {};
    const categoryFilter = category && category !== 'all' ? { category } : {};

    const events = await Event.find({
      ...queryFilter,
      ...categoryFilter,
    })
      .skip(pageSize * (page - 1))
      .limit(pageSize);

    const countEvents = await Event.countDocuments({
      ...queryFilter,
      ...categoryFilter,
    });
    res.send({
      events,
      countEvents,
      page,
      pages: Math.ceil(countEvents / pageSize),
    });
  })
);

eventRouter.get(
  '/categories',
  expressAsyncHandler(async (req, res) => {
    const categories = await Event.find().distinct('category');
    res.send(categories);
  })
);

eventRouter.get('/slug/:slug', async (req, res) => {
  const event = await Event.findOne({ slug: { $eq: req.params.slug } });

  if (event) {
    res.send(event);
  } else {
    res.status(404).send({ message: 'Event Not Found' });
  }
});
eventRouter.get('/:id', async (req, res) => {
  const event = await Event.findById(req.params.id);
  if (event) {
    res.send(event);
  } else {
    res.status(404).send({ message: 'Event Not Found' });
  }
});

export default eventRouter;