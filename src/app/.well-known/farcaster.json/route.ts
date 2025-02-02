import { PROJECT_TITLE } from "~/lib/constants";

export async function GET() {
  const appUrl = process.env.NEXT_PUBLIC_URL || `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;

  const config = {
    accountAssociation: {
      message: {
        domain: "looppredict.vercel.app",
        timestamp: 1738529918,
        expirationTime: 1746305918
      },
      signature: "54c52b82ca8e15ba5a624d53dc1073ec6181f449da98f1a5c90b8174902266ad6c587cc5df3721d7510ff8f67fbfa3dace11795013dcc81b82625073a4b445051c",
      signingKey: "a3ce0456c7d0b693a0a25aa1e26ea953796db8ae5de105f9d4c38948e535c359"
    },
    frame: {
      version: "1",
      name: PROJECT_TITLE,
      iconUrl: `${appUrl}/icon.png`,
      homeUrl: appUrl,
      imageUrl: `${appUrl}/frames/hello/opengraph-image`,
      buttonTitle: "Launch Frame",
      splashImageUrl: `${appUrl}/splash.png`,
      splashBackgroundColor: "#f7f7f7",
      webhookUrl: `${appUrl}/api/webhook`,
    },
  };

  return Response.json(config);
}
