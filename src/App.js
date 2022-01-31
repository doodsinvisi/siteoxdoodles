import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { connect } from "./redux/blockchain/blockchainActions";
import { fetchData } from "./redux/data/dataActions";
import * as s from "./styles/globalStyles";
import styled from "styled-components";

const truncate = (input, len) =>
  input.length > len ? `${input.substring(0, len)}...` : input;

export const StyledButton = styled.button`
  padding: 10px;
  border-radius: 50px;
  border: none;
  background-color: #FFCC00;
  padding: 10px;
  font-weight: bold;
  color: #000000;
  width: 200px;
  cursor: pointer;
  box-shadow: 0px 6px 0px -2px #e68200;
  box-shadow-color: #e68200;
  -webkit-box-shadow: 0px 6px 0px -2px #e68200);
  -moz-box-shadow: 0px 6px 0px -2px #e68200;
  :active {
    box-shadow: none;
    -webkit-box-shadow: none;
    -moz-box-shadow: none;
  }
`;
export const StyledBut = styled.button`
  padding: 10px;
  border-radius: 50px;
  border: none;
  background-color: #FFCC00;
  padding: 10px;
  font-weight: bold;
  color: #000000;
  width: 100px;
  cursor: pointer;
  box-shadow: 0px 6px 0px -2px #e68200;
  box-shadow-color: #e68200;
  -webkit-box-shadow: 0px 6px 0px -2px #e68200);
  -moz-box-shadow: 0px 6px 0px -2px #e68200;
  :active {
    box-shadow: none;
    -webkit-box-shadow: none;
    -moz-box-shadow: none;
  }
`;

export const StyledRoundButton = styled.button`
  padding: 10px;
  border-radius: 100%;
  border: none;
  background-color: #FFCC00;
  padding: 10px;
  font-weight: bold;
  font-size: 15px;
  color: #000000;
  width: 30px;
  height: 30px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0px 4px 0px -2px #cdad31;
  -webkit-box-shadow: 0px 4px 0px -2px #cdad31;
  -moz-box-shadow: 0px 4px 0px -2px #cdad31;
  :active {
    box-shadow: none;
    -webkit-box-shadow: none;
    -moz-box-shadow: none;
  }
`;

export const ResponsiveWrapper = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  justify-content: stretched;
  align-items: stretched;
  width: 100%;
  @media (min-width: 767px) {
  flex-direction: row;
  }
`;

export const StyledLogo = styled.img`
  width: 250px;
  @media (min-width: 1500px) {
    width: 1600px;
  }
  transition: width 0.5s;
  transition: height 0.5s;
`;
export const Styledteam = styled.img`
  width: 771px;
  @media (min-width: 1500px) {
    width: 1550px;
  }
  transition: width 0.5s;
  transition: height 0.5s;
`;

export const StyledLog = styled.img`
  width: 250px;
  @media (min-width: 500px) {
    width: 500px;
  }
  transition: width 0.5s;
  transition: height 0.5s;
`;

export const Styledrm = styled.img`
  width: 500px;
  @media (min-width: 1000px) {
    width: 500px;
  }
  transition: width 0.5s;
  transition: height 0.5s;
`;

export const Styledlo = styled.img`
  width: 100px;
  @media (min-width: 100px) {
    width: 100px;
  }
  transition: width 0.5s;
  transition: height 0.5s;
`;

export const StyledImg = styled.img`
  background-color: #0000;
  border-radius: 0%;
  width: 200px;
  @media (min-width: 900px) {
    width: 250px;
  }
  @media (min-width: 1000px) {
    width: 500px;
  }
  transition: width 0.5s;
`;

export const StyledLink = styled.a`
  color: #000000;
   background-color: #FFCC00;
   border-radius: 10%;
`;

function App() {
  const dispatch = useDispatch();
  const blockchain = useSelector((state) => state.blockchain);
  const data = useSelector((state) => state.data);
  const [claimingNft, setClaimingNft] = useState(false);
  const [feedback, setFeedback] = useState(`Click buy to mint your NFT.`);
  const [mintAmount, setMintAmount] = useState(1);
  const [CONFIG, SET_CONFIG] = useState({
    CONTRACT_ADDRESS: "",
    SCAN_LINK: "",
    CONT: "",
    CONT_LINK: "",
    TWEET: "",
    TWEET_LINK: "",
    DISC: "",
    DISC_LINK: "",
    LOG: "",
    LOG_LINK: "",
    NETWORK: {
      NAME: "",
      SYMBOL: "",
      ID: 0,
    },
    NFT_NAME: "",
    SYMBOL: "",
    MAX_SUPPLY: 1,
    WEI_COST: 0,
    DISPLAY_COST: 0,
    GAS_LIMIT: 0,
    MARKETPLACE: "",
    MARKETPLACE_LINK: "",
    SHOW_BACKGROUND: true,
  });

  const claimNFTs = () => {
    let cost = CONFIG.WEI_COST;
    let gasLimit = CONFIG.GAS_LIMIT;
    let totalCostWei = String(cost * mintAmount);
    let totalGasLimit = String(gasLimit * mintAmount);
    console.log("Cost: ", totalCostWei);
    console.log("Gas limit: ", totalGasLimit);
    setFeedback(`Minting your ${CONFIG.NFT_NAME}...`);
    setClaimingNft(true);
    blockchain.smartContract.methods
      .mint(mintAmount)
      .send({
        gasLimit: String(totalGasLimit),
        to: CONFIG.CONTRACT_ADDRESS,
        from: blockchain.account,
        value: totalCostWei,
      })
      .once("error", (err) => {
        console.log(err);
        setFeedback("Sorry, something went wrong please try again later.");
        setClaimingNft(false);
      })
      .then((receipt) => {
        console.log(receipt);
        setFeedback(
          `WOW, the ${CONFIG.NFT_NAME} is yours! go visit Opensea.io to view it.`
        );
        setClaimingNft(false);
        dispatch(fetchData(blockchain.account));
      });
  };

  const decrementMintAmount = () => {
    let newMintAmount = mintAmount - 1;
    if (newMintAmount < 1) {
      newMintAmount = 1;
    }
    setMintAmount(newMintAmount);
  };

  const incrementMintAmount = () => {
    let newMintAmount = mintAmount + 1;
    if (newMintAmount > 20) {
      newMintAmount = 20;
    }
    setMintAmount(newMintAmount);
  };

  const getData = () => {
    if (blockchain.account !== "" && blockchain.smartContract !== null) {
      dispatch(fetchData(blockchain.account));
    }
  };

  const getConfig = async () => {
    const configResponse = await fetch("/config/config.json", {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });
    const config = await configResponse.json();
    SET_CONFIG(config);
  };

  useEffect(() => {
    getConfig();
  }, []);

  useEffect(() => {
    getData();
  }, [blockchain.account]);

  return (
    <s.Screen>
      <s.Container
        flex={1}
        ai={"center"}
        style={{ padding: 0, backgroundColor: "var(--primary)" }}
        image={CONFIG.SHOW_BACKGROUND ? "/config/images/bg.png" : null}
      >
        <StyledLogo alt={"logo"} src={"/config/images/0xlogo.png"} />
        <s.SpacerSmall />
        <ResponsiveWrapper flex={1} style={{ padding: 0 }} test>
          <s.Container flex={1} jc={"center"} ai={"center"}>
            <StyledImg alt={"example"} src={"/config/images/dood2.gif"} />
          </s.Container>
          <s.SpacerLarge />
          <s.Container
            flex={2}
            jc={"center"}
            ai={"center"}
            style={{
              backgroundColor: "#000000",
              padding: 0,
              borderRadius: 30,
              boxShadow: "03px 5px 11px 10px rgba(0,0,0,0.7) , color: #FFCC00",
            }}
          ><ResponsiveWrapper flex={1} jc={"center"} ai={"center"} style={{ padding: 10 }} test>
          <s.Container flex={1} jc={"center"} ai={"center"}>
          <Styledlo alt={"logo"} src={"/config/images/tweet.png"} />
          <StyledBut><StyledLink target={"_blank"} href={CONFIG.TWEET_LINK}>
                {truncate(CONFIG.TWEET, 10)}
              </StyledLink></StyledBut>
          
        <s.SpacerSmall />
          </s.Container>
          <s.Container flex={1} jc={"center"} ai={"center"}>
          <Styledlo alt={"logo"} src={"/config/images/disc.png"} />
          <StyledBut><StyledLink target={"_blank"} href={CONFIG.DISC_LINK}>
                {truncate(CONFIG.DISC, 10)}
              </StyledLink></StyledBut>
        <s.SpacerSmall />
          </s.Container>
          <s.Container flex={1} jc={"center"} ai={"center"}>
          <Styledlo alt={"logo"} src={"/config/images/os.png"} />
          <StyledBut><StyledLink target={"_blank"} href={CONFIG.MARKETPLACE_LINK}>
                {truncate(CONFIG.MARKETPLACE, 10)}
              </StyledLink></StyledBut>
              
        <s.SpacerSmall />
          </s.Container>
          <s.Container flex={1} jc={"center"} ai={"center"}>
          <Styledlo alt={"logo"} src={"/config/images/go.png"} />
          <StyledBut><StyledLink target={"_blank"} href={CONFIG.LOG_LINK}>
                {truncate(CONFIG.LOG, 10)}
              </StyledLink></StyledBut>
        <s.SpacerSmall />
          </s.Container>
          </ResponsiveWrapper>
            <s.TextTitle
              style={{
                textAlign: "center",
                fontSize: 50,
                fontWeight: "bold",
                color: "#FFCC00",
              }}
            ><StyledLog alt={"logo"} src={"/config/images/logo.png"} />
            <s.TextDescription
                        style={{
                          textAlign: "center",
                          color: "#FFCC00",
                          fontSize: 25,
                        }}
                      >
                        0xDoodles on the Blockchain
                      </s.TextDescription>
              {data.totalSupply} / {CONFIG.MAX_SUPPLY}
            </s.TextTitle>
            <s.SpacerSmall />
            {Number(data.totalSupply) >= CONFIG.MAX_SUPPLY ? (
              <>
                <s.TextTitle
                  style={{ textAlign: "center", color: "var(--accent-text)" }}
                >
                  The sale has ended.
                </s.TextTitle>
                <s.TextDescription
                  style={{ textAlign: "center", color: "#FFCC00" }}
                >
                  You can still find {CONFIG.NFT_NAME} on
                </s.TextDescription>
                <s.SpacerSmall />
                <StyledLink target={"_blank"} href={CONFIG.MARKETPLACE_LINK}>
                  {CONFIG.MARKETPLACE}
                </StyledLink>
              </>
            ) : (
              <>
                <s.TextTitle
                  style={{ textAlign: "center", color: "#FFCC00" }}
                >
                  1 {CONFIG.SYMBOL} costs {CONFIG.DISPLAY_COST}{" "}
                  {CONFIG.NETWORK.SYMBOL}.
                </s.TextTitle>
                <s.SpacerXSmall />
                <s.SpacerSmall />
                {blockchain.account === "" ||
                blockchain.smartContract === null ? (
                  <s.Container ai={"center"} jc={"center"}>
                    <s.TextDescription
                      style={{
                        textAlign: "center",
                        color: "var(--accent-text)",
                      }}
                    >
                      Connect to the {CONFIG.NETWORK.NAME} network
                    </s.TextDescription>
                    <s.SpacerSmall />
                    <StyledButton
                      onClick={(e) => {
                        e.preventDefault();
                        dispatch(connect());
                        getData();
                      }}
                    >
                      CONNECT
                    </StyledButton>
                    {blockchain.errorMsg !== "" ? (
                      <>
                        <s.SpacerSmall />
                        <s.TextDescription
                          style={{
                            textAlign: "center",
                            color: "var(--accent-text)",
                          }}
                        >
                          {blockchain.errorMsg}
                        </s.TextDescription>
                      </>
                    ) : null}
                  </s.Container>
                ) : (
                  <>
                    <s.TextDescription
                      style={{
                        textAlign: "center",
                        color: "var(--accent-text)",
                      }}
                    >
                      {feedback}
                    </s.TextDescription>
                    <s.SpacerMedium />
                    <s.Container ai={"center"} jc={"center"} fd={"row"}>
                      <StyledRoundButton
                        style={{ lineHeight: 0.4 }}
                        disabled={claimingNft ? 1 : 0}
                        onClick={(e) => {
                          e.preventDefault();
                          decrementMintAmount();
                        }}
                      >
                        -
                      </StyledRoundButton>
                      <s.SpacerMedium />
                      <s.TextDescription
                        style={{
                          textAlign: "center",
                          color: "var(--accent-text)",
                        }}
                      >
                        {mintAmount}
                      </s.TextDescription>
                      <s.SpacerMedium />
                      <StyledRoundButton
                        disabled={claimingNft ? 1 : 0}
                        onClick={(e) => {
                          e.preventDefault();
                          incrementMintAmount();
                        }}
                      >
                        +
                      </StyledRoundButton>
                    </s.Container>
                    <s.SpacerSmall />
                    <s.Container ai={"center"} jc={"center"} fd={"row"}>
                      <StyledButton
                        disabled={claimingNft ? 1 : 0}
                        onClick={(e) => {
                          e.preventDefault();
                          claimNFTs();
                          getData();
                        }}
                      >
                        {claimingNft ? "BUSY" : "BUY"}
                      </StyledButton>
                    </s.Container>
                  </>
                )}
              </>
            )}
            <s.SpacerMedium />
          </s.Container>
          <s.SpacerLarge />
          <s.Container flex={1} jc={"center"} ai={"center"}>
            <StyledImg
              alt={"example"}
              src={"/config/images/dood1.gif"}
          
            />
          </s.Container>
        </ResponsiveWrapper>
        <s.SpacerMedium />
        <s.Container jc={"center"} ai={"center"} style={{ width: "70%" }}>
          <s.TextDescription
            style={{
              textAlign: "center",
              color: "var(--primary-text)",
            }}
          >
            Please make sure you are connected to the right network (
            {CONFIG.NETWORK.NAME} Mainnet) and the correct address. Please note:
            Once you make the purchase, you cannot undo this action.
          </s.TextDescription>
          <s.SpacerSmall />
          <s.TextDescription
            style={{
              textAlign: "center",
              color: "#FFCC00",
            }}
          >
            We have set the gas limit to {CONFIG.GAS_LIMIT} for the contract to
            successfully mint your NFT. We recommend that you don't lower the
            gas limit.
          </s.TextDescription>
          <s.SpacerLarge /><s.SpacerLarge />
        </s.Container>
        <StyledLogo alt={"logo"} src={"/config/images/rmf2.png"} />
        <s.SpacerSmall />
        <ResponsiveWrapper flex={1} style={{ padding: 0 }} test>
          <s.Container flex={1} jc={"center"} ai={"center"}>
          <Styledrm alt={"logo"} src={"/config/images/royalty.png"} />
        <s.SpacerSmall />
          </s.Container>
          <s.Container flex={1} jc={"center"} ai={"center"}>
          <Styledrm alt={"logo"} src={"/config/images/dao.png"} />
        <s.SpacerSmall />
          </s.Container>
          <s.Container flex={1} jc={"center"} ai={"center"}>
          <Styledrm alt={"logo"} src={"/config/images/give.png"} />
        <s.SpacerSmall />
          </s.Container>
          </ResponsiveWrapper>
          <s.SpacerLarge /><s.SpacerLarge /><s.SpacerLarge />
          <Styledteam alt={"logo"} src={"/config/images/art.png"} />
      </s.Container>
      <s.TextDescription
                        style={{
                          textAlign: "center",
                          color: "#000000",
                        }}
                      >
                        *This Project is NOT affiliated with DoodlesLLC*
                      </s.TextDescription>
    </s.Screen>
  );
}

export default App;
