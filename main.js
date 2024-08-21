
window.storageSongs = {

  getSongs: (listId = "songs") => {
    const songsStr = localStorage.getItem(listId);
    if (songsStr) {
      return JSON.parse(songsStr);
    } return [];
  },

  getSongAt: (index, listId = "songs") => {
    const songs = window.storageSongs.getSongs(listId);
    return songs[index];
  },

  setSongs: (songs, listId = "songs") => {
    localStorage.setItem(listId, JSON.stringify(songs));
  },

  addSong: (dataItem, listId = "songs") => {
    const songs = window.storageSongs.getSongs(listId);
    songs.push(dataItem)
    window.storageSongs.setSongs(songs, listId);
  },

  //window.storageSongs.getSongs() -> [a,b,c,d]
  // const newList = [a,b,c,d].splice(1,1) -> [a,c,d]
  // window.storageSongs.clearSongs() -> []
  // for (i ... newList)
  // window.storageSongs.addSong(i)

  removeSongAt: (index, listId = "songs") => {
    const songs = window.storageSongs.getSongs(listId);
    songs.splice(index, 1)
    console.log("remove at:", index, songs, " from list: ", listId);
    window.storageSongs.setSongs(songs, listId);
  },


  clearSongs: (listId = "songs") => {
    localStorage.removeItem(listId);
  }

}


$(function () {
  //wait for DOM to be ready

  const $repo = $("#repository");
  const $mainSong = $("#main-song-wrapper");
  const $favSong = $("#favorite-song-wrapper");

  const $mainTools = $mainSong.find(".song-buttons")
  const $modalAddSong = $mainSong.find(".dialog-add-song")

  const $songList = $("#main-song-list");
  const $songFavList = $("#fav-song-list");

  const $modalFavSong = $favSong.find(".dialog-fav-song")

  let lastIndex = 0;

  //$songList.sortable();


  // window.storageSongs.clearSongs('favSongs');
  // addFavSong({ title: "a", url: "b" });
  // addFavSong({ title: "a2", url: "b2" });


  function addFavSong(songData) {
    const $favSong = $repo.find("#favorite-list .item").clone();
    $favSong.find('.title').html(songData.title);
    window.storageSongs.addSong(songData, 'favSongs')
    $songFavList.append($favSong);
  }

  function addSong(title, url, iframe) {
    if (!title) {
      alert("Song title cannot be empty!");
      return false;
    }

    const $newSong = $repo.find("#song-list .item").clone();
    $newSong.find(".title").html(title);

    $newSong.find(".a_a").html("#" + (lastIndex + 1));

    const $songFrame = $newSong.find(".my-youtube-iframe");

    let normUrl = '';

    if (url) {
      if (!url.startsWith("https://www.youtube.com/embed/")) {
        alert("Invalid youtube embeded url!");
        return false;
      }
      $songFrame.prop("src", url);
      normUrl = url;
    } else {
      if (iframe) {
        if (!iframe.startsWith("<iframe")) {
          alert("Invalid youtube iframe!");
          return false;
        }
        $songFrame.replaceWith(iframe);
        normUrl = $($.parseHTML(iframe)).get(0).src;
      } else {
        alert('Fill either "youtube embeded url" or  "youtube iframe"');
        return false;
      }
    }

    $songList.append($newSong);

    window.storageSongs.addSong({ title, url: normUrl }); 

    lastIndex++;
    return true;
  }


  function initSongList() {

    const storedSongs = window.storageSongs.getSongs()
    const storedSongsCount = storedSongs.length;

    if (!storedSongsCount) {
      defaultSongList();
    } else {

      window.storageSongs.clearSongs();

      for (let index = 0; index < storedSongs.length; index++) {
        const song = storedSongs[index];
        //console.log("song ", index, song);
        addSong(song.title, song.url);
      }
    }


    const storedFavSongs = window.storageSongs.getSongs('favSongs');
    window.storageSongs.clearSongs('favSongs');
    if (storedFavSongs) {
      for (let index = 0; index < storedFavSongs.length; index++) {
        const song = storedFavSongs[index];
        //console.log("song ", index, song);
        addFavSong(song);
      }
    }


  }


  function defaultSongList() {

    window.storageSongs.clearSongs();

    const dataset = [
      { title: "Sabrina Carpenter - Espresso", url: "https://www.youtube.com/embed/eVli-tstM5E?si=Xi5PBQBphb6gbz4D" },
      { title: "Eminem - Lose Yourself", url: "https://www.youtube.com/embed/_Yhyp-_hX2s?si=t9UwDN8B_wJErbPA" },
      { title: "Taylor Swift - Lavender Haze", url: "https://www.youtube.com/embed/h8DLofLM7No?si=PoYNcM5uk-nJchHp" },
      { title: "Depeche Mode - Enjoy the Silence", url: "https://www.youtube.com/embed/aGSKrC7dGcY?si=vf8W6oc9HpbePHWX" },
    ];

    for (const data of dataset) {
      addSong(data.title, data.url, null);
    }

    // for (let i = 0; i < count; i++) {
    //   const title = `song ${i + 1}`;
    //   const url = "https://www.youtube.com/embed/wp10dsoOYjs?si=RVxhY28Lzmwwq_j5";
    //   addSong(title, url, null);
    // }
  }


  // $('#myModal').on('shown.bs.modal', function () {
  //   $('#myInput').trigger('focus')
  // })



  $modalAddSong.find(".add").click(function (e) {

    const $form = $modalAddSong.find(".new-song-form");
    const titleEL = $form.find('[name="title"]');
    const iframeUrlEl = $form.find('[name="iframe-url"]');
    const iframeTextEl = $form.find('[name="iframe-textarea"]');

    const added = addSong(titleEL.val(), iframeUrlEl.val(), iframeTextEl.val());

    if (added) {
      titleEL.val("");
      iframeUrlEl.val("");
      iframeTextEl.val("")
      $modalAddSong.modal('hide');
    }

  })


  $mainTools.find(".add").click(() => {

    //only test
    //addSong("Test", "https://www.youtube.com/embed/iOYdcPlVfBQ?si=A7Na1l4lQcqUouis", null);
    $modalAddSong.modal('show');
  });

  // $mainTools.find(".remove").click(() => {
  //   $songList.children().last().remove();
  //   lastIndex--;
  // });


  $songList.on("click", '.favorite', function (e) {
    const $item = $(this).closest(".item");
    const selectedIndex = $item.index();
    const selectedSong = window.storageSongs.getSongAt(selectedIndex);
    addFavSong(selectedSong);
  });

  $songList.on("click", '.remove', function (e) {
    //e.target, this
    const $item = $(this).closest(".item");
    const deletedIndex = $item.index();
    $item.remove();
    lastIndex--;

    $songList.find(".item").each(function (index) {
      $(this).find(".a_a").html("#" + (index + 1));
    })

    console.log("remove at index:", deletedIndex);
    window.storageSongs.removeSongAt(deletedIndex)

    //addSong, getSongs, clearSongs
    //window.storageSongs.addSong()  -> //[a,b,c,d] -> [a,c,d]

    //window.storageSongs.getSongs() -> [a,b,c,d]
    // const newList = [a,b,c,d].splice(1,1) -> [a,c,d]
    // window.storageSongs.clearSongs() -> []
    // for (i ... newList)
    // window.storageSongs.addSong(i)


  });


  function createIframeSong(dataSong) {
    const $song = $repo.find("#song-list .item").clone();
    $song.find(".title").html(dataSong.title);

    $song.find(".a_a, .tools").remove();

    const $songFrame = $song.find(".my-youtube-iframe");
    $songFrame.prop("src", dataSong.url);
    return $song;
  }


  $songFavList.on("click", '.item .link', function (e) {
    const $item = $(this).closest(".item");
    const selectedIndex = $item.index();
    const selectedSong = window.storageSongs.getSongAt(selectedIndex, 'favSongs')

    console.log("selectedSong:", selectedSong);


    const $modalBodyList = $modalFavSong.find(".modal-body .list");
    $song = createIframeSong(selectedSong);

    console.log($song.get(0));
    $modalBodyList.empty();
    $modalBodyList.append($song);

    $modalFavSong.modal("show");

  })


  $songFavList.on("click", '.item .remove', function (e) {
    const $item = $(this).closest(".item");
    const selectedIndex = $item.index();
    window.storageSongs.removeSongAt(selectedIndex, "favSongs");
    $item.remove();
  });


  $("#link-fav-all").click(() => {
    const allFavsongs = window.storageSongs.getSongs("favSongs");
    const $modalBodyList = $modalFavSong.find(".modal-body .list");
    
    $modalBodyList.empty();

    for (let index = 0; index < allFavsongs.length; index++) {
      const favSong = allFavsongs[index];
      const $song = createIframeSong(favSong);
      $modalBodyList.append($song);
    }

    $modalFavSong.modal ("show");
  })

  initSongList();
});
