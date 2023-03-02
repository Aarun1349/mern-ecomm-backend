class APIFeatures {
  constructor(query, queryStr) {
    this.query = query;
    this.queryStr = queryStr;
  }

  search() {
    const keywords = this.queryStr.keyword
      ? {
          product_name: {
            $regex: this.queryStr.keyword,
            $options: "i", //caseinsensitive
          },
        }
      : {};
    this.query = this.query.find({ ...keywords });
  }
  filter() {
    const queryCopy = { ...this.queryStr };
    // Removing fields from the query
    const removeFields = ["keyword", "limit", "page"];
    removeFields.forEach((el = delete queryCopy[el]));

    //Advance filter for price , rating etc
    let queryStr = JSON.stringify(queryCopy);
    queryStr = queryStr.replace(/\b(gt|lt|gte|lte)\b/g, (match) => {
      `$${match}`;
    });
    this.query = this.query.find(JSON.parse(queryStr));
    return this;
  }
}

module.exports = APIFeatures;
