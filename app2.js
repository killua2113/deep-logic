const express = require('express');
const https = require('https');


const app = express();
app.get('/getTimeStories', async (req, res) => {
    try {
      const request = https.get('https://time.com', (response) => {
        let data = '';
        response.on('data', (chunk) => {
          data += chunk;
        });
        response.on('end', () => {
          try {
            const stories = extractLatestStories(data);
            res.send(stories);
          } catch (error) {
            console.error(error);
            res.status(500).send('Error parsing HTML');
          }
        });
      });
  
      request.on('error', (error) => {
        console.error(error);
        res.status(500).send('Error fetching the link');
      });
    } catch (error) {
      console.error(error);
      res.status(500).send('Error fetching the link');
    }
  });
  
  
function extractLatestStories(html) {

  const regex = /<li class="latest-stories__item">[\s\S]*?<a href="([^"]+)">[\s\S]*?<h3 class="latest-stories__item-headline">([^<]+)<\/h3>/g;

  let match;
  const stories = [];
  
  while ((match = regex.exec(html)) !== null) {
      const link = match[1];
      const title = match[2];
      stories.push({ title, link });
  }
  
  console.log(stories);
return stories;
}


  
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

