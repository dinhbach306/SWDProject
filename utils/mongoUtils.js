class mongoUtils {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }

  filter() {
    //Example: /api/v1/test?difficulty=easy&number[gte]=5
    const queryObj = { ...this.queryString };
    const excludedFields = ['page', 'sort', 'limit', 'fields'];
    excludedFields.forEach((el) => delete queryObj[el]);

    //Advanced filter
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);

    return this;
  }

  sort() {
    //Example: /api/v1/test?sort=-price,rating
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(',').join(' ');
      this.query = this.query.sort(sortBy); //mongoose query
    } else {
      this.query = this.query.sort('-createdAt');
    }

    return this;
  }

  limitFields() {
    //Example: /api/v1/test?fields=name,price,difficulty
    if (this.queryString.fields) {
      const fields = this.queryString.fields.split(',').join(' ');
      this.query = this.query.select(fields); //mongoose query
    } else {
      this.query = this.query.select('-__v');
    }

    return this;
  }

  paginate() {
    //Example: /api/v1/test?page=2&limit=10
    const page = this.queryString.page * 1 || 1; //convert string to number
    const limit = this.queryString.limit * 1 || 10; //convert string to number
    const skip = (page - 1) * limit;

    this.query = this.query.skip(skip).limit(limit); //mongoose query
    return this;
  }
}

module.exports = mongoUtils;
