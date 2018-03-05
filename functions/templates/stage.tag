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
                9: "https://firebasestorage.googleapis.com/v0/b/haru067-a007c.appspot.com/o/splatoon%2Fstages%2F9.jpg?alt=media&token=51201199-4f35-4b02-96ad-67328bfd0086",
                10: "https://firebasestorage.googleapis.com/v0/b/haru067-a007c.appspot.com/o/splatoon%2Fstages%2F10.jpg?alt=media&token=512c7700-24ee-496e-86bf-9cf297e88afd",
                11: "https://firebasestorage.googleapis.com/v0/b/haru067-a007c.appspot.com/o/splatoon%2Fstages%2F11.jpg?alt=media&token=44b01442-eadf-4823-9f2f-73d874af22d8",
                12: "https://firebasestorage.googleapis.com/v0/b/haru067-a007c.appspot.com/o/splatoon%2Fstages%2F12.jpg?alt=media&token=0e7e56aa-341c-4496-a9d3-2caa089c808b",
                13: "https://firebasestorage.googleapis.com/v0/b/haru067-a007c.appspot.com/o/splatoon%2Fstages%2F13.jpg?alt=media&token=51a672eb-3dad-4641-91eb-48c91076d8d2",
                14: "https://firebasestorage.googleapis.com/v0/b/haru067-a007c.appspot.com/o/splatoon%2Fstages%2F14.jpg?alt=media&token=6835de06-7f62-45f1-90f1-0444083c4e81",
                15: "https://firebasestorage.googleapis.com/v0/b/haru067-a007c.appspot.com/o/splatoon%2Fstages%2F15.jpg?alt=media&token=3e4c9024-00a1-4bd1-bb7e-f35cd046ad2f",
                18: "https://firebasestorage.googleapis.com/v0/b/haru067-a007c.appspot.com/o/splatoon%2Fstages%2F18.jpg?alt=media&token=817f07bf-8a9a-40c8-a2b9-338f401283ee",
            }
            return map[id];
        }
    </script>
</stage>