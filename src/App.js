import React, { useState } from 'react';
import { Grid, Container, Message, Button, Icon, Segment } from 'semantic-ui-react';
import mammoth from 'mammoth';
import pretty from 'pretty';
import { FilePicker } from 'react-file-picker';

const App = () => {
  const [convertedHTML, setConvertedHTML] = useState(null);
  const [messages, setMessages] = useState(null);
  const [loading, setLoading] = useState(false);

  const options = {
    convertImage: mammoth.images.imgElement(function(image) {
      return image.read("base64").then(function(imageBuffer) {
        return {
          src: "media/FILENAME",
          alt: "ALT_TEXT"
        };
      });
    })
  };

  function handleFileSelect(event) {
    setLoading(true)
    readFileInputEventAsArrayBuffer(event, function(arrayBuffer) {
      mammoth.convertToHtml({ arrayBuffer: arrayBuffer }, options)
        .then(result => {
          console.log(result);
          setConvertedHTML(result.value);
          setMessages(result.messages);
          setLoading(false);
        })
        .done();
    });
  }

  function readFileInputEventAsArrayBuffer(file, callback) {
    var reader = new FileReader();
    reader.onload = function(loadEvent) {
      var arrayBuffer = loadEvent.target.result;
      callback(arrayBuffer);
    };
    reader.readAsArrayBuffer(file);
  }

  return (
    <Container>
      <Grid>
        <Grid.Column width={10}>
          <h2>Convert Word File to HTML</h2>
        </Grid.Column>
        <Grid.Column width={6} textAlign="right">
          <FilePicker
            extensions={['docx']}
            onChange={FileObject => (handleFileSelect(FileObject))}
            onError={err => (console.log(err))}
          >
            <Button color="blue" disabled={!!loading}><Icon name="file word" /> Select a Word Document</Button>
          </FilePicker>
        </Grid.Column>
      </Grid>
      {!!messages &&
        <Message>
          <p><strong>Ohp, looks like there were some issues while converting the file:</strong></p>
          {messages.map((message, index) => {
            return <li key={index}>{message.message}</li>
          })}
        </Message>
      }
      <Segment style={{overflow:'auto', height: '70vh' }} loading={loading}>
        {!!convertedHTML &&
          <pre>
            {pretty(convertedHTML, { ocd: true })}
          </pre>
        }
      </Segment>
    </Container>
  )
}

export default App;
