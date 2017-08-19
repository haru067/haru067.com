<round class="round">
    <div class="date">
        <h2>{round.date}</h2>
        <h1>{round.time}</h1>
    </div>
    <div class="schedule-container">
        <schedule class="schedule" schedule={round.regular} />
        <schedule class="schedule" schedule={round.gachi} />
        <schedule class="schedule" schedule={round.league} />
    </div>

    <script>
        this.round = opts.round;
    </script>
</round>