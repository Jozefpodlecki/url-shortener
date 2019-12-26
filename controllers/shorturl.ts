import * as dns from 'dns';
import Urls from '../models/url'
import Sequences from '../models/sequence'
const protocolRegExp = /^https?:\/\/(.*)/i;
const hostnameRegExp = /^([a-z0-9\-_]+\.)+[a-z0-9\-_]+/i;

const generateId = () => new Promise((resolve, reject) => {
  const sequence_id = 'url_id';
  
  Sequences.findByIdAndUpdate(sequence_id, {
    $inc:{
      value: 1
    }
  }, (err, data) => {
    if (err) {
      return;
    }

    if (data) {
      resolve(data.value);
      return;
    }

    const sequence = new Sequences({
      _id: sequence_id
    });

    sequence.save((err, data1) => {
      if (err) {
        reject(err);
        return;
      }
      
      resolve(sequence.value);
    });
  });
});

const addUrl = async (req, res) => {
    let { url } = req.body;
    
    if (url.match(/\/$/i))
      url = url.slice(0, -1);
    
    const protocolMatch = url.match(protocolRegExp);
    if (!protocolMatch) {
      res.json({
        error: "invalid URL"
      });
      return;
    }
    
    const [ , hostAndQuery ] = protocolMatch;

    const [ hostnameMatch ] = hostAndQuery.match(hostnameRegExp);
    if (!hostnameMatch) {
      res.json({
        error: "invalid Hostname"
      });
      return;
    }

    const dnsLookup = (lookupUrl) => new Promise<any>((resolve, reject) => {
      console.log(lookupUrl)
      dns.lookup(lookupUrl, (err, address, family) => resolve({err, address, family}))  
    })
    
    const { err: dnsError } = await dnsLookup(hostnameMatch);
    
    if(dnsError) {
      res.json({
        error: dnsError.message
      });
      return;
    }
  
    const findOne = new Promise<any>((resolve, reject) => {
      Urls.findOne({url}, (err, storedUrl) => resolve({err, storedUrl}))  
    })
    const { err, storedUrl } = await findOne;
  
    if (err) {
      res.json({
        error: err
      });
      return
    }

    if (storedUrl) {

      res.json({
        original_url: url,
        short_url: storedUrl._id
      });
      return;
    } 

    const _id = await generateId();
    const urlEntry = new Urls({
      url: url,
      _id
    });

    urlEntry.save((err) => {

      if (err) {
        res.json({
          error: err
        });
        return;
      }

      res.json({
        original_url: url,
        short_url: urlEntry._id
      });

    });
}

const getUrl = (req, res) => {
  const { id } = req.params;
  console.log( id)
  if (!parseInt(id, 10)) {
    res.json({
      error: "Wrong Format"
    });

    return;
  }

  Urls.findById(id, (err, { url = null } = {}) => {
      if (err) {
        res.json({
          error: err
        });
        return;
      }

      if (url) {
        res.redirect(url);
        return;
      } 

      res.json({
        error: "No short url found for given input"
      });
  });
};


export default {
  addUrl,
  getUrl
}