const jwt = require("jsonwebtoken");
const crypto = require("crypto");

const secretKey = "public-herkeste-olacak-secret-key";

exports.testJwtBench = async (req, res) => {
  const { text } = req.body;

  // Get token from header
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({
      status: "fail",
      message: "No token provided",
    });
  }

  // Verify token and get id
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  const userId = decoded.id;

  // Encrypt userId with SHA256 to generate the encryption key
  const hash = crypto
    .createHmac("sha256", secretKey)
    .update("öncesine bir şey" + userId.toString() + "sonrasına bir şey")
    .digest("hex");

  // Generate a 16-byte IV
  const iv = crypto.randomBytes(16);

  // Create Cipher with AES-256-CBC
  const cipher = crypto.createCipheriv(
    "aes-256-cbc",
    Buffer.from(hash, "hex"),
    iv
  );

  // Encrypt the text
  let encrypted = cipher.update(text, "utf8", "hex");
  encrypted += cipher.final("hex");

  // Combine IV and encrypted text for transmission
  const hashtext = `${iv.toString("hex")}:${encrypted}`;

  // Return response with text and encrypted id
  res.status(200).json({
    status: "success",
    data: {
      hashtext,
    },
  });
};

exports.decodeJwtBench = async (req, res) => {
  const { hashtext } = req.body;

  if (!hashtext) {
    return res.status(400).json({
      status: "fail",
      message: "hashtext is required in request body",
    });
  }

  // Get token from header
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({
      status: "fail",
      message: "No token provided",
    });
  }

  // Verify token and get id
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  const userId = decoded.id;

  // Encrypt userId with SHA256 to generate the decryption key
  const hash = crypto
    .createHmac("sha256", secretKey)
    .update("öncesine bir şey" + userId.toString() + "sonrasına bir şey")
    .digest("hex");

  try {
    // Split IV and encrypted text
    const [ivHex, encryptedText] = hashtext.split(":");

    // Convert IV from hex to buffer
    const iv = Buffer.from(ivHex, "hex");

    // Create Decipher with AES-256-CBC
    const decipher = crypto.createDecipheriv(
      "aes-256-cbc",
      Buffer.from(hash, "hex"),
      iv
    );

    // Decrypt the text
    let decrypted = decipher.update(encryptedText, "hex", "utf8");
    decrypted += decipher.final("utf8");

    res.status(200).json({
      status: "success",
      data: {
        text: decrypted,
      },
    });
  } catch (error) {
    res.status(400).json({
      status: "fail",
      message: "Invalid hashtext or unable to decrypt",
    });
  }
};
