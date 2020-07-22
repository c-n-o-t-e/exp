if(date - currentDate > 30443906){
                              
                              let txPromise = epnsContractWithSigner.sendMessage(usersAddress, parseInt(payload.data.type), ipfshash, 1);
                                  
                              txPromise
                                .then(function(tx) {
                                  logger.info("Transaction sent: %o", tx);
                                  resolve({ success: 1, data: tx });
                                })
                                  .catch(err => {
                                    reject("Unable to complete transaction, error: %o", err)
                                    throw err;
                                  });
                            }
                          })
                      })
                    }
                })
            })
              .catch(err => {
                reject("Unable to obtain ipfshash, error: %o", err)
                throw err;
              });
        })
          .catch(err => {
            logger.error(err);
            reject("Unable to proceed message", err);
            throw err;
          });
    });
  }
 
  public async getNewMessage() {
      const logger = this.logger;
      logger.debug('Preparing message...');

         return await new Promise((resolve, reject) => {
           const title = "k";
          const message = "m";

          const payloadTitle = "o";
          const payloadMsg = "y";

          const payload = {
            "notification": {
              "title": title,
              "body": message
            },
            "data": {
              "type": "1", // Group Message
              "secret": "",
              "asub": payloadTitle,
              "amsg": payloadMsg,
              "acta": "",
              "aimg": ""
            }
          };

          resolve(payload);
        })
 }
}
