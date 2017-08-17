<round class="round">
    <h1>{round.date}</h1>
    <div class="schedule-container">
        <schedule class="schedule" schedule={round.regular} />
        <schedule class="schedule" schedule={round.gachi} />
        <schedule class="schedule" schedule={round.league} />
    </div>
    <hr>

    <script>
        this.round = opts.round;
    </script>
</round>