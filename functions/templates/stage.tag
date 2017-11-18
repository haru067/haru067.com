<stage>
    <img src={getStageImageUrl(stage.id)} alt={stage.name} width="160px" height="90px">
    <div class="name">{stage.name}</div>

    <script>
        this.stage = opts.stage;
        this.getStageImageUrl = (id) => {
            const map = {
                0: "https://firebasestorage.googleapis.com/v0/b/haru067-a007c.appspot.com/o/splatoon%2Fstages%2F0.jpg?alt=media&token=f5168aff-3751-43bf-8a8e-600524bea898",
                1: "https://firebasestorage.googleapis.com/v0/b/haru067-a007c.appspot.com/o/splatoon%2Fstages%2F1.jpg?alt=media&token=269ff28d-9d22-4846-b30f-59a30da7c960",
                2: "https://firebasestorage.googleapis.com/v0/b/haru067-a007c.appspot.com/o/splatoon%2Fstages%2F2.jpg?alt=media&token=ef45c021-349b-4987-b601-2893665b8e36",
                3: "https://firebasestorage.googleapis.com/v0/b/haru067-a007c.appspot.com/o/splatoon%2Fstages%2F3.jpg?alt=media&token=6dccc814-8be5-451f-8ae4-34dacf319573",
                4: "https://firebasestorage.googleapis.com/v0/b/haru067-a007c.appspot.com/o/splatoon%2Fstages%2F4.jpg?alt=media&token=3b3402cf-8974-4ed2-95c5-3d395cd00e83",
                5: "https://firebasestorage.googleapis.com/v0/b/haru067-a007c.appspot.com/o/splatoon%2Fstages%2F5.jpg?alt=media&token=8cf7c6d7-fa84-431b-81a4-1702cee492af",
                6: "https://firebasestorage.googleapis.com/v0/b/haru067-a007c.appspot.com/o/splatoon%2Fstages%2F6.jpg?alt=media&token=e4055808-30ea-41f8-96c0-bfb510f4325c",
                7: "https://firebasestorage.googleapis.com/v0/b/haru067-a007c.appspot.com/o/splatoon%2Fstages%2F7.jpg?alt=media&token=8515b8fb-0623-4362-9ebb-ac52efbf7689",
                8: "https://firebasestorage.googleapis.com/v0/b/haru067-a007c.appspot.com/o/splatoon%2Fstages%2F8.jpg?alt=media&token=5f562b3d-6065-49bb-b06c-61719dbe47d1",
                9: "https://firebasestorage.googleapis.com/v0/b/haru067-a007c.appspot.com/o/splatoon%2Fstages%2F9.png?alt=media&token=9778e8f2-7c7b-4eed-93ef-dbb6f41b8219",
                10: "https://firebasestorage.googleapis.com/v0/b/haru067-a007c.appspot.com/o/splatoon%2Fstages%2F10.jpg?alt=media&token=512c7700-24ee-496e-86bf-9cf297e88afd",
                11: "https://firebasestorage.googleapis.com/v0/b/haru067-a007c.appspot.com/o/splatoon%2Fstages%2F11.png?alt=media&token=d0daad67-13e7-4487-b6e4-1a459717003c",
            }
            return map[id];
        }
    </script>
</stage>