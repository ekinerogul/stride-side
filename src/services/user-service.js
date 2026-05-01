const BaseService = require("./base-service");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

class UserService extends BaseService {
  async insert(userData) {
    const hashedPassword = await bcrypt.hash(userData.password, 10);
    return await this.model.create({ ...userData, password: hashedPassword });
  }

  async findByName(name) {
    return this.findBy("name", name);
  }

  async findByLocation(location) {
    return this.findBy("location", location);
  }

  async findByRating(rating) {
    return this.findBy("rating", rating);
  }

  async findByLanguage(language) {
    return this.findBy("languages", language);
  }

  async login(email, password, type) {
    const user = await this.model.findOne({ email }).select("+password");
    if (!user) return null;
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return null;
    const token = jwt.sign(
      { id: user._id, type: type },
      process.env.JWT_SECRET,
      { expiresIn: "7d" },
    );
    const userObj = user.toObject();
    delete userObj.password;
    return { user: userObj, token };
  }
}

module.exports = UserService;
