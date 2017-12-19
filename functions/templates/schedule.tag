<schedule class={schedule.game_mode.key}>
    <div class="title">
        <h1>{ruleName}</h1>
    </div>
    <div class="stage-container">
        <stage class="stage-a" stage={ schedule.stage_a } />
        <stage class="stage-b" stage={ schedule.stage_b } />
    </div>

    <script>
        this.schedule = opts.schedule
        this.isRegularMatch = opts.schedule.game_mode.key == 'regular';
        this.isRegularMatch = opts.schedule.game_mode.key == 'regular';
        if (this.isRegularMatch) {
            this.ruleName = this.schedule.rule.name;
        } else if (this.schedule.rule.key == 'tower_control'){
            this.ruleName = `${this.schedule.game_mode.name} - ヤグラ`;
        } else if (this.schedule.rule.key == 'rainmaker'){
            this.ruleName = `${this.schedule.game_mode.name} - ホコ`;
        } else if (this.schedule.rule.key == 'splat_zones'){
            this.ruleName = `${this.schedule.game_mode.name} - エリア`;
        } else if (this.schedule.rule.key == 'clam_blitz'){
            this.ruleName = `${this.schedule.game_mode.name} - アサリ`;
        } else {
            this.ruleName = this.schedule.rule.name;
        }
    </script>
</schedule>