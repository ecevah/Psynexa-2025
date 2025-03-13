import fs from "fs";
import path from "path";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    // Get email from request body
    const { email } = await request.json();

    if (!email || typeof email !== "string") {
      return NextResponse.json(
        { error: "Email is required and must be a string" },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 }
      );
    }

    // Define path to JSON file
    const filePath = path.join(process.cwd(), "src", "get-mails.json");

    // Read existing data
    let data;
    try {
      const fileContent = fs.readFileSync(filePath, "utf8");
      data = JSON.parse(fileContent);
    } catch (err) {
      // If file doesn't exist or is invalid, create a new structure
      data = { emails: [] };
    }

    // Check if email already exists
    if (data.emails.includes(email)) {
      return NextResponse.json(
        { error: "Email already subscribed" },
        { status: 400 }
      );
    }

    // Add new email to the list
    data.emails.push(email);

    // Save updated data back to file
    try {
      fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf8");
    } catch (err) {
      console.error("Error saving email to file:", err);
      return NextResponse.json(
        { error: "Failed to save email" },
        { status: 500 }
      );
    }

    // Return success response
    return NextResponse.json(
      { message: "Email saved successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error processing request:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
