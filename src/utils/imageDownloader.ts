export class ImageDownloader {
  /**
   * Download image based on a current url (used while browsing images)
   */

  getImgIdDynmically(url: string): string {
    let splittedUrl = url.split("/");
    return splittedUrl[splittedUrl.length - 1];
  }

  stripImgIdFromToken(imgId: string): string {
    let splittedImgId = imgId.split("?");
    return splittedImgId[0];
  }

  downloadImage(): void {
    let imgId = this.getImgIdDynmically(window.location.href);
    let url = `https://drive.lienuc.com/uc?id=${imgId}`;
    fetch(url)
      .then((resp) => resp.blob())
      .then((blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.style.display = "none";
        a.referrerPolicy = "no-referrer";
        a.href = url;
        a.download = this.stripImgIdFromToken(imgId!); // * filename
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
      })
      .catch((err) => {
        alert("An error has occured! Contact dev team.");
        console.log(err);
      });
  }
}
