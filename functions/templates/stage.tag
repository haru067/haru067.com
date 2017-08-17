<stage class="stage">
    <img src={getStageImageUrl(stage.id)} width="160px" height="80px">
    <p>{stage.name}</p>

    <script>
        this.stage = opts.stage;
        this.getStageImageUrl = (id) => {
            const map = {
                1: "https://firebasestorage.googleapis.com/v0/b/haru067-a007c.appspot.com/o/splatoon%2Fstages%2F1.jpg?alt=media&token=bc410f73-1d73-4ba0-8505-54378d98db3a",
                2: "https://firebasestorage.googleapis.com/v0/b/haru067-a007c.appspot.com/o/splatoon%2Fstages%2F2.jpg?alt=media&token=2273fbe8-9eab-49f7-b4ec-95c5b74d0eea",
                0: "https://firebasestorage.googleapis.com/v0/b/haru067-a007c.appspot.com/o/splatoon%2Fstages%2F0.jpg?alt=media&token=631e7666-0ff2-4201-abbb-6e8844f874df",
                3: "https://firebasestorage.googleapis.com/v0/b/haru067-a007c.appspot.com/o/splatoon%2Fstages%2F3.jpg?alt=media&token=e0de67a7-e690-404b-b746-679ed0d2a3b4",
                4: "https://firebasestorage.googleapis.com/v0/b/haru067-a007c.appspot.com/o/splatoon%2Fstages%2F4.jpg?alt=media&token=fed9fd01-ae07-40ac-9497-8b0f3694d896",
                5: "https://firebasestorage.googleapis.com/v0/b/haru067-a007c.appspot.com/o/splatoon%2Fstages%2F5.jpg?alt=media&token=67c506da-54b4-41f8-84dd-4edc6750c010",
                6: null,
                7: "https://firebasestorage.googleapis.com/v0/b/haru067-a007c.appspot.com/o/splatoon%2Fstages%2F7.jpg?alt=media&token=61ebfb66-6908-416d-ad67-1ebd8bf455c3",
                8: "https://firebasestorage.googleapis.com/v0/b/haru067-a007c.appspot.com/o/splatoon%2Fstages%2F8.jpg?alt=media&token=b14f3eb8-62fc-401e-a2cc-20d2483e4b71"
            }
            return map[id];
        }
    </script>
</stage>