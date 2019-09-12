import React, { useState } from 'react';
import { Grid, Container, Message, Button, Icon, Segment, Radio } from 'semantic-ui-react';
import mammoth from 'mammoth';
import pretty from 'pretty';
import { FilePicker } from 'react-file-picker';

const App = () => {
  const [convertedHTML, setConvertedHTML] = useState(null);
  const [formatPretty, setFormatPretty] = useState(true);
  const [messages, setMessages] = useState(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

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
          setConvertedHTML(result.value);
          setMessages(result.messages);
          setCopied(false);
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

  function copyToClipboard() {
    navigator.clipboard.writeText(formatPretty ? pretty(convertedHTML, { ocd: true }) : convertedHTML)
    .then(() => {
      setCopied(true)
      setTimeout(function(){ setCopied(false); }, 1000);
    });
  };

  return (
    <Container>
      <Grid>
        <Grid.Column width={8}>
          <h2>Convert Word File to HTML</h2>
        </Grid.Column>
        <Grid.Column width={2} textAlign="right" style={{paddingTop: '21px'}}>
          Pretty HTML &nbsp; &nbsp;
          <Radio toggle checked={formatPretty} style={{position: 'absolute', top: '20px'}} onChange={() => {setFormatPretty(formatPretty ? false : true)}} />
        </Grid.Column>
        <Grid.Column width={6} textAlign="right">
          <FilePicker
            maxSize={10}
            extensions={['docx']}
            onChange={FileObject => (handleFileSelect(FileObject))}
            onError={err => (console.log(err))}
          >
            <Button color="blue" disabled={!!loading}><Icon name="file word" /> Select a Word Document</Button>
          </FilePicker>
        </Grid.Column>
      </Grid>
      {!!messages && !!messages.length &&
        <Message>
          <p><strong>Ohp, looks like there were some issues while converting the file:</strong></p>
          {messages.map((message, index) => {
            return <li key={index}>{message.message}</li>
          })}
        </Message>
      }
      <Segment attached='top' style={{overflow:'auto', height: '60vh' }} loading={loading}>
        {!!convertedHTML &&
          <pre>
            {formatPretty ? pretty(convertedHTML, { ocd: true }) : convertedHTML}
          </pre>
        }

      </Segment>
      {}
      <Segment attached='bottom' textAlign='right'>
        <Button
          style={{ transition: 'background-color 0.25s ease' }}
          size="mini"
          icon="clipboard outline"
          content="Copy to Clipboard"
          color={copied ? 'green' : 'grey'}
          disabled={!convertedHTML}
          onClick={copyToClipboard} />
      </Segment>

    </Container>
  )
}

export default App;
