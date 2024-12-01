import express from "express";
import axios from "axios";
import bodyParser from "body-parser";

const app = express();
const port = 3000;
//use API

const EDAMAM_APP_ID= "cdab8efd";
const EDAMAM_APP_KEY= "c755d14e392d67aacf51135d88e52454";

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json()); // For parsing JSON request bodies
app.use(express.static("public"));

// Route to render the form
app.get("/", (req, res) => {
    res.render("index.ejs", { analysis: null, error: null });
  });

  // Route to handle recipe analysis
app.post("/analyze", async (req, res) => {
    const { title, ingredients } = req.body;
  
    const recipe = {
      title: title || "Recipe",
      ingr: ingredients.split("\n"), // Split ingredients by new lines
    };
  
    try {
      const response = await axios.post(
        `https://api.edamam.com/api/nutrition-details?app_id=${EDAMAM_APP_ID}&app_key=${EDAMAM_APP_KEY}`,
        recipe,
        { headers: { "Content-Type": "application/json" } }
      );
      res.render("index.ejs", { analysis: response.data, error: null });
    } catch (error) {
      console.error("Error analyzing recipe:", error.message);
      res.render("index.ejs", { analysis: null, error: error.response.data.message });
    }
  });
  
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
  });
