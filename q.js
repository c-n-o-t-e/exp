import Web3 from 'web3';
import Staking from '../build/contracts/StakingToken.json';

let web3;
let staking;

const initWeb3 = () => {
return new Promise((resolve, reject) => {
    if(typeof window.ethereum !== 'undefined') {
      const web3 = new Web3(window.ethereum);
      window.ethereum.enable()
        .then(() => {
          resolve(
            new Web3(window.ethereum)
          );
        })
        .catch(e => {
          reject(e);
        });
      return;
    }
    if(typeof window.web3 !== 'undefined') {
      return resolve(
        new Web3(window.web3.currentProvider)
      );
    }
    resolve(new Web3(alert(`You are currently not logged in! Please login to your metamask account and switch to infura testnet then try again. Don't have a metamask? Click here (https://metamask.io/download.html)`)));
  });
}  

const initContract = () => {
  const contractAddress ='0xcB0F16DC344376cEaB27E850b16B56704b09252a'
  const deploymentKey = Object.keys(Staking.networks)[0];
  return new web3.eth.Contract(
    Staking.abi,
    contractAddress
  );
};

const initApp = () => {
   web3.eth.net.getNetworkType()
.then(result => {
  if(result == 'ropsten'){}
    else{
      alert('please use rinkeby')
    };
});

  const name = document.getElementById('name');
  const nameResult = document.getElementById('name-result');
  const symbol = document.getElementById('symbol');
  const symbolResult = document.getElementById('symbol-result');
  const supply = document.getElementById('supply');
  const supplyResult = document.getElementById('supply-result');
  const stakes = document.getElementById('stakes');
  const stakesResult = document.getElementById('stakes-result');
  const number = document.getElementById('number');
  const numberResult = document.getElementById('number-result');
  const pool = document.getElementById('pool');
  const poolResult = document.getElementById('pool-result');
  const percent = document.getElementById('percent');
  const percentResult = document.getElementById('percent-result');
  const withdraw = document.getElementById('withdraw');
  const withdrawResult = document.getElementById('withdraw-result');
  const distribute = document.getElementById('distribute');
  const distributeResult = document.getElementById('distribute-result');
  const stake = document.getElementById('stake');
  const stakeResult = document.getElementById('stake-result');
  const unstake = document.getElementById('unstake');
  const unstakeResult = document.getElementById('unstake-result');
  const stakeholders = document.getElementById('stakeholders');
  const stakeholdersResult = document.getElementById('stakeholders-result');
  const stakeof = document.getElementById('stakeof');
  const stakeofResult = document.getElementById('stakeof-result');
  const rewardof = document.getElementById('rewardof');
  const rewardofResult = document.getElementById('rewardof-result');
  const referrals = document.getElementById('referrals');
  const referralsResult = document.getElementById('referrals-result');
  const transfer = document.getElementById('transfer');
  const transferResult = document.getElementById('transfer-result');
  const bulk = document.getElementById('bulk');
  const bulkResult = document.getElementById('bulk-result');
  const balance = document.getElementById('balance');
  const balanceResult = document.getElementById('balance-result');
  
  let accounts;
  let accountInterval = setInterval(function() {
  web3.eth.getAccounts().then(_accounts => {
  accounts = _accounts;
  });
   }, 100);

  function checkPoolForDistribution() {
    let stakeholdersCountBeforeUpdate;
    let currentStakeholdersCount;
    let totalStakeingPool;

    staking.methods.stakeholdersCount().call()
      .then(result => {  
        stakeholdersCountBeforeUpdate = result
      })

    staking.methods.callAddTodayCount().call()
      .then(result => {  
        currentStakeholdersCount = result
      })

    let newStakers = currentStakeholdersCount - stakeholdersCountBeforeUpdate;

    let value = newStakers * 100;
    let percentGrowth = value/(stakeholdersCountBeforeUpdate);

    staking.methods.updatePercent(percentGrowth).call();

      if(percentGrowth >= 10){
        staking.methods.totalStakeingPool().call()
        .then(result => { totalStakeingPool = parseIntresult
        })

        let val = totalStakeingPool * percentGrowth;
        let getPoolToShare = val / 1000;
        totalStakeingPool = totalStakeingPool - getPoolToShare;

        staking.methods.updateStakingPool(totalStakeingPool).send({from: accounts[0]});
        rewardToShare = getPoolToShare;
        distributeRewards();
      }
      
    staking.methods.addPoolCaller().call();
  }
    

  function distributeRewards() {
        let stakeholders;

        staking.methods.stakeholders().call()
        .then(result => {
          stakeholders = result;
        })

      for (let s = 0; s < stakeholders.length; s += 1){
          let stakeholder = stakeholders[s];
          let stakeholderReward;

          let reward = calculateReward(stakeholder);

          let upLineBonus = reward * 0.04;

          staking.methods.addUplineProfit(stakeholder,Math.round(upLineBonus)).call()

          let referralPool = reward * 0.01;

          staking.methods.addToReferralPool(Math.round(referralPool)).call()

          let userResult = reward - (upLineBonus +referralPool);
          let userReferredList = staking.methods.stakeholdersReferredList(stakeholder).call();

          checkReferralList(userReferredList)

          staking.methods.bonus(stakeholder).call()
          .then(result => {
            if(result > 0){
              staking.methods.addToReferralPool(result).send({from: accounts[0]})
              staking.methods.revertUplineProfit(stakeholder).send({from: accounts[0]})
            }
          })

          staking.methods.rewardOf(stakeholder).call()
          .then(result1 => {
            stakeholderReward = result1+ Math.round(userResult)
          })

          staking.methods.addReward(stakeholder,stakeholderReward).send({from: accounts[0]})
        }
      }

  function checkReferralList(list) {
    for (let i = 0; i < list.length; s += 1){
      if(list.length === 0){}
      else{
        staking.methods.checkAddressInStakeholderList(stakeholder, i).send({from: accounts[0]})
        .then(result => {
          staking.methods.bonus(result).call()
          .then(result => {
            staking.methods.addReward(stakeholder,result).send({from: accounts[0]})
            staking.methods.revertUplineProfit(result).send({from: accounts[0]})
          })
        })
      }
    }
  }

  function calculateReward(stakeholder){
    let result;
    let totalStakes;

    staking.methods.totalStakes().call()
    .then(result => {
      totalStakes = result
    })

    staking.methods.stakeOf(stakeholder).call()
    .then(result1 => {  
      result = (result1 * rewardToShare)/totalStakes 
    })
      return result;
  }


 distribute.addEventListener('click',(e) => {
    e.preventDefault();
    checkPoolForDistribution()
    .then(result => {
      distributeResult.innerHTML = `successful`;
    })
    .catch(() => {
      distributeResult.innerHTML = `error`;
    }); 

  });

 name.addEventListener('click', (e) => {
    e.preventDefault();
        staking.methods.name().call()
    .then(result => {
      nameResult.innerHTML = result;
    })
    .catch(() => {
      nameResult.innerHTML = `error`;
    }); 
  });

 symbol.addEventListener('click', (e) => {
    e.preventDefault();
        staking.methods.symbol().call()
    .then(result => {
      symbolResult.innerHTML = result;
    })
    .catch(() => {
      symbolResult.innerHTML = `error`;
    });
  });

 supply.addEventListener('click', (e) => {
    e.preventDefault();
        staking.methods.totalSupply().call()
    .then(result => {
      supplyResult.innerHTML = result;
    })
    .catch(() => {
      supplyResult.innerHTML = `error`;
    });
  });

 stakes.addEventListener('click', (e) => {
    e.preventDefault();
        staking.methods.totalStakes().call()
    .then(result => {
      stakesResult.innerHTML = result;
    })
    .catch(() => {
      stakesResult.innerHTML = `error`;
    });
  });

 number.addEventListener('click', (e) => {
    e.preventDefault();
        staking.methods.stakeholdersIndex().call()
    .then(result => {
      numberResult.innerHTML = result;
    })
    .catch(() => {
      numberResult.innerHTML = `error`;
    });
  });

 pool.addEventListener('click', (e) => {
    e.preventDefault();
        staking.methods.totalStakingPool().call()
    .then(result => {
      poolResult.innerHTML = result;
    })
    .catch(() => {
      poolResult.innerHTML = `error`;
    });
  });

 percent.addEventListener('click', (e) => {
    e.preventDefault();
        staking.methods.percentGrowth().call()
    .then(result => {
      percentResult.innerHTML = result;
    })
    .catch(() => {
      percentResult.innerHTML = `error`;
    });
  });

 withdraw.addEventListener('click', (e) => {
    e.preventDefault();
        staking.methods.withdrawReward().call()
    .then(result => {
      withdrawResult.innerHTML = `withdrawal successful`;
    })
    .catch(() => {
      withdrawResult.innerHTML = `error`;
    });
  });

 stake.addEventListener('submit', (e) => {
    e.preventDefault();
    const amount = e.target.elements[0].value;
    const address = e.target.elements[1].value;
    if(address === ''){address = '0x0000000000000000000000000000000000000000'}
    staking.methods.createStake(amount, address).send({from: accounts[0]})
    .then(result => {
      stakeResult.innerHTML = `your staking was successful`;
    })
    .catch(_e => {
      stakeResult.innerHTML = `Ooops...there was an error while trying to stake, this error might be due to if; staking is below 20 PoSH tokens, referree is not a stakeholder, referre is sender, sender already added referree.`;
    });
  });

 unstake.addEventListener('submit', (e) => {
    e.preventDefault();
    const amount = e.target.elements[0].value;
    staking.methods.removeStake(amount).send({from: accounts[0]})
    .then(result => {
      unstakeResult.innerHTML = `your unstaking was successful`;
    })
    .catch(_e => {
      unstakeResult.innerHTML = `error minimum unstake is 20 PoSH tokens`;
    });
  });

 stakeholders.addEventListener('submit', (e) => {
    e.preventDefault();
    const address = e.target.elements[0].value;
    staking.methods.stakeholders(address).call()
    .then(result => {
      stakeholdersResult.innerHTML = `stakeholder: ${result[0]}<br> id: ${result[1]}`;
    })
    .catch(_e => {
      stakeholdersResult.innerHTML = `error`;
    });
  });

 stakeof.addEventListener('submit', (e) => {
    e.preventDefault();
    const address = e.target.elements[0].value;
    staking.methods.stakeOf(address).call()
    .then(result => {
      stakeofResult.innerHTML = result;
    })
    .catch(_e => {
      stakeofResult.innerHTML = `error`;
    });
  });

 rewardof.addEventListener('submit', (e) => {
    e.preventDefault();
    const address = e.target.elements[0].value;
    staking.methods.rewardOf(address).call()
    .then(result => {
      rewardofResult.innerHTML = result;
    })
    .catch(_e => {
      rewardofResult.innerHTML = `error`;
    });
  });

 referrals.addEventListener('submit', (e) => {
    e.preventDefault();
    const address = e.target.elements[0].value;
    staking.methods.stakeholdersReferredList(address).call()
    .then(result => {
      referralsResult.innerHTML = result;
    })
    .catch(_e => {
      referralsResult.innerHTML = `error`;
    });
  });

 transfer.addEventListener('submit', (e) => {
    e.preventDefault();
    const address = e.target.elements[0].value;
    const amount = e.target.elements[1].value;
    staking.methods.transfer(address,amount).send({from: accounts[0]})
    .then(result => {
      transferResult.innerHTML = `your transfer was successful`;
    })
    .catch(_e => {
      transferResult.innerHTML = `error`;
    });
  });

 bulk.addEventListener('submit', (e) => {
    e.preventDefault();
    const address = e.target.elements[0].value;
    const amount = e.target.elements[1].value;
    staking.methods.bulkTransfer(address,amount).send({from: accounts[0]})
    .then(result => {
      bulkResult.innerHTML = `your transfer was successful`;
    })
    .catch(_e => {
      bulkResult.innerHTML = `error; length of receivers must be equal to length of amount`;
    });
  });

 balance.addEventListener('submit', (e) => {
    e.preventDefault();
    const address = e.target.elements[0].value;
    staking.methods.balanceOf(address).call()
    .then(result => {
      balanceResult.innerHTML = result;
    })
    .catch(_e => {
      balanceResult.innerHTML = `error`;
    });
  });
}
 document.addEventListener('DOMContentLoaded', () => {
  initWeb3()
    .then(_web3 => {
      web3 = _web3;
      staking = initContract();
      initApp(); 
    })
    .catch(e => console.log(e.message));
})
