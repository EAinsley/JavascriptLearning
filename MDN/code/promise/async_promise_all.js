async function FetchAndDecode(url) {
  try {
    let response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    } else {
      const contenttype = response.headers.get("content-type");
      if (/image/.test(contenttype)) {
        return response.blob();
      } else if (/text/.test(contenttype)) {
        return response.text();
      } else {
        throw new Error(
          `In function FetchAndDecode,\nType error! Unsupported MIME type: ${contenttype}`
        );
      }
    }
  } catch (e) {
    console.log(
      `There has been a problem with your fetch operation for resources "${ulr}": ` +
        e.message
    );
  } finally {
    console.log("fetch finished.");
  }
}

let coffee = FetchAndDecode("/MDN/img/coffee.jpg");
let tea = FetchAndDecode("/MDN/img/tea.jpg");
let descrption = FetchAndDecode("/MDN/resource/description.txt");

function CreatElementFromResponse(response) {
  if (typeof response === "string") {
    const textnode = document.createElement("p");
    textnode.textContent = response;
    return textnode;
  } else if (response instanceof Blob) {
    const objectURL = URL.createObjectURL(response);
    const image = document.createElement("img");
    image.src = objectURL;
    return image;
  } else {
    throw new Error(
      'In fucntion CreatElementFromResponse,\nType error! response is neither "string" or "Blob"'
    );
  }
}

async function DisplayContent(contents) {
  let values = await Promise.all(contents);
  console.log(values);
  for (const value of values) {
    document.body.append(CreatElementFromResponse(value));
  }
  console.log("display finished");
}

DisplayContent([coffee, tea, descrption]);
