<schedule class="schedule">
    <div if={isRegularMatch} class="title">
        <h1>{schedule.rule.name}</h1>
    </div>
    <div if={!isRegularMatch} class="title">
        <h1>{schedule.game_mode.name}</h1>
        <h2>{schedule.rule.name}</h2>
    </div>
    <div class="stage-container">
        <stage stage={ schedule.stage_a } />
        <stage stage={ schedule.stage_b } />
    </div>

    <script>
        this.schedule = opts.schedule
        this.isRegularMatch = opts.schedule.game_mode.key == 'regular';
    </script>
</schedule>