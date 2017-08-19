<schedule class={schedule.game_mode.key}>
    <div if={isRegularMatch} class="title">
        <h1>{schedule.rule.name}</h1>
    </div>
    <div if={!isRegularMatch} class="title">
        <h1>{schedule.game_mode.name} - {schedule.rule.name}</h1>
    </div>
    <div class="stage-container">
        <stage class="stage-a" stage={ schedule.stage_a } />
        <stage class="stage-b" stage={ schedule.stage_b } />
    </div>

    <script>
        this.schedule = opts.schedule
        this.isRegularMatch = opts.schedule.game_mode.key == 'regular';
    </script>
</schedule>