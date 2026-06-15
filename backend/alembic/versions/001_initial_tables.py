"""Initial tables

Revision ID: 001
Revises: 
Create Date: 2026-06-15

"""
from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision = '001'
down_revision = None
branch_labels = None
depends_on = None


def upgrade() -> None:
    # Users table
    op.create_table(
        'users',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('email', sa.String(), nullable=True),
        sa.Column('name', sa.String(), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('(CURRENT_TIMESTAMP)')),
        sa.Column('updated_at', sa.DateTime(timezone=True), onupdate=sa.text('(CURRENT_TIMESTAMP)')),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_users_email'), 'users', ['email'], unique=True)
    op.create_index(op.f('ix_users_id'), 'users', ['id'], unique=False)

    # Athlete Profiles table
    op.create_table(
        'athlete_profiles',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('user_id', sa.Integer(), nullable=True),
        sa.Column('primary_sport', sa.String(), nullable=True),
        sa.Column('timezone', sa.String(), nullable=True),
        sa.Column('birth_year', sa.Integer(), nullable=True),
        sa.Column('sex', sa.String(), nullable=True),
        sa.Column('height_cm', sa.Float(), nullable=True),
        sa.Column('weight_kg', sa.Float(), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('(CURRENT_TIMESTAMP)')),
        sa.Column('updated_at', sa.DateTime(timezone=True), onupdate=sa.text('(CURRENT_TIMESTAMP)')),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_athlete_profiles_id'), 'athlete_profiles', ['id'], unique=False)
    op.create_index(op.f('ix_athlete_profiles_user_id'), 'athlete_profiles', ['user_id'], unique=False)

    # Connected Accounts table
    op.create_table(
        'connected_accounts',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('user_id', sa.Integer(), nullable=True),
        sa.Column('provider', sa.String(), nullable=False),
        sa.Column('access_token', sa.String(), nullable=True),
        sa.Column('refresh_token', sa.String(), nullable=True),
        sa.Column('provider_user_id', sa.String(), nullable=True),
        sa.Column('last_sync_at', sa.DateTime(timezone=True), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('(CURRENT_TIMESTAMP)')),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_connected_accounts_id'), 'connected_accounts', ['id'], unique=False)
    op.create_index(op.f('ix_connected_accounts_user_id'), 'connected_accounts', ['user_id'], unique=False)

    # Activities table
    op.create_table(
        'activities',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('user_id', sa.Integer(), nullable=True),
        sa.Column('provider_activity_id', sa.String(), nullable=True),
        sa.Column('sport', sa.String(), nullable=True),
        sa.Column('start_time', sa.DateTime(timezone=True), nullable=True),
        sa.Column('duration_seconds', sa.Integer(), nullable=True),
        sa.Column('distance_meters', sa.Float(), nullable=True),
        sa.Column('tss', sa.Float(), nullable=True),
        sa.Column('intensity_factor', sa.Float(), nullable=True),
        sa.Column('avg_hr', sa.Float(), nullable=True),
        sa.Column('max_hr', sa.Float(), nullable=True),
        sa.Column('avg_power', sa.Float(), nullable=True),
        sa.Column('normalized_power', sa.Float(), nullable=True),
        sa.Column('avg_pace', sa.Float(), nullable=True),
        sa.Column('elevation_gain', sa.Float(), nullable=True),
        sa.Column('raw_data', sa.JSON(), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('(CURRENT_TIMESTAMP)')),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_activities_id'), 'activities', ['id'], unique=False)
    op.create_index(op.f('ix_activities_provider_activity_id'), 'activities', ['provider_activity_id'], unique=False)
    op.create_index(op.f('ix_activities_user_id'), 'activities', ['user_id'], unique=False)

    # Daily Athlete States table
    op.create_table(
        'daily_athlete_states',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('user_id', sa.Integer(), nullable=True),
        sa.Column('date', sa.Date(), nullable=False),
        sa.Column('data_level', sa.String(), nullable=True),
        sa.Column('fitness', sa.Float(), nullable=True),
        sa.Column('fatigue', sa.Float(), nullable=True),
        sa.Column('form', sa.Float(), nullable=True),
        sa.Column('sleep_score', sa.Float(), nullable=True),
        sa.Column('hrv_score', sa.Float(), nullable=True),
        sa.Column('acwr', sa.Float(), nullable=True),
        sa.Column('monotony', sa.Float(), nullable=True),
        sa.Column('strain', sa.Float(), nullable=True),
        sa.Column('adherence', sa.Float(), nullable=True),
        sa.Column('subjective_fatigue', sa.Float(), nullable=True),
        sa.Column('training_capacity', sa.Float(), nullable=True),
        sa.Column('capacity_status', sa.String(), nullable=True),
        sa.Column('training_risk_score', sa.Float(), nullable=True),
        sa.Column('training_risk_level', sa.String(), nullable=True),
        sa.Column('confidence', sa.Float(), nullable=True),
        sa.Column('state_json', sa.JSON(), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('(CURRENT_TIMESTAMP)')),
        sa.PrimaryKeyConstraint('id'),
        sa.UniqueConstraint('user_id', 'date')
    )
    op.create_index(op.f('ix_daily_athlete_states_id'), 'daily_athlete_states', ['id'], unique=False)
    op.create_index(op.f('ix_daily_athlete_states_user_id'), 'daily_athlete_states', ['user_id'], unique=False)

    # Daily Recommendations table
    op.create_table(
        'daily_recommendations',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('user_id', sa.Integer(), nullable=True),
        sa.Column('date', sa.Date(), nullable=False),
        sa.Column('day_type', sa.String(), nullable=True),
        sa.Column('sport', sa.String(), nullable=True),
        sa.Column('workout_type', sa.String(), nullable=True),
        sa.Column('title', sa.String(), nullable=True),
        sa.Column('duration_minutes', sa.Integer(), nullable=True),
        sa.Column('expected_tss', sa.Float(), nullable=True),
        sa.Column('intensity', sa.String(), nullable=True),
        sa.Column('workout_structure', sa.JSON(), nullable=True),
        sa.Column('decision_json', sa.JSON(), nullable=True),
        sa.Column('user_friendly_reason', sa.String(), nullable=True),
        sa.Column('technical_reason', sa.String(), nullable=True),
        sa.Column('confidence', sa.Float(), nullable=True),
        sa.Column('status', sa.String(), default='active'),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('(CURRENT_TIMESTAMP)')),
        sa.Column('updated_at', sa.DateTime(timezone=True), onupdate=sa.text('(CURRENT_TIMESTAMP)')),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_daily_recommendations_id'), 'daily_recommendations', ['id'], unique=False)
    op.create_index(op.f('ix_daily_recommendations_user_id'), 'daily_recommendations', ['user_id'], unique=False)

    # Weekly Reviews table
    op.create_table(
        'weekly_reviews',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('user_id', sa.Integer(), nullable=True),
        sa.Column('week_start', sa.Date(), nullable=True),
        sa.Column('week_end', sa.Date(), nullable=True),
        sa.Column('adherence', sa.Float(), nullable=True),
        sa.Column('weekly_tss', sa.Float(), nullable=True),
        sa.Column('load_change', sa.Float(), nullable=True),
        sa.Column('training_risk_level', sa.String(), nullable=True),
        sa.Column('summary', sa.String(), nullable=True),
        sa.Column('highlights', sa.JSON(), nullable=True),
        sa.Column('warnings', sa.JSON(), nullable=True),
        sa.Column('next_week_recommendation', sa.String(), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('(CURRENT_TIMESTAMP)')),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_weekly_reviews_id'), 'weekly_reviews', ['id'], unique=False)
    op.create_index(op.f('ix_weekly_reviews_user_id'), 'weekly_reviews', ['user_id'], unique=False)


def downgrade() -> None:
    op.drop_index(op.f('ix_weekly_reviews_user_id'), table_name='weekly_reviews')
    op.drop_index(op.f('ix_weekly_reviews_id'), table_name='weekly_reviews')
    op.drop_table('weekly_reviews')

    op.drop_index(op.f('ix_daily_recommendations_user_id'), table_name='daily_recommendations')
    op.drop_index(op.f('ix_daily_recommendations_id'), table_name='daily_recommendations')
    op.drop_table('daily_recommendations')

    op.drop_index(op.f('ix_daily_athlete_states_user_id'), table_name='daily_athlete_states')
    op.drop_index(op.f('ix_daily_athlete_states_id'), table_name='daily_athlete_states')
    op.drop_table('daily_athlete_states')

    op.drop_index(op.f('ix_activities_user_id'), table_name='activities')
    op.drop_index(op.f('ix_activities_provider_activity_id'), table_name='activities')
    op.drop_index(op.f('ix_activities_id'), table_name='activities')
    op.drop_table('activities')

    op.drop_index(op.f('ix_connected_accounts_user_id'), table_name='connected_accounts')
    op.drop_index(op.f('ix_connected_accounts_id'), table_name='connected_accounts')
    op.drop_table('connected_accounts')

    op.drop_index(op.f('ix_athlete_profiles_user_id'), table_name='athlete_profiles')
    op.drop_index(op.f('ix_athlete_profiles_id'), table_name='athlete_profiles')
    op.drop_table('athlete_profiles')

    op.drop_index(op.f('ix_users_id'), table_name='users')
    op.drop_index(op.f('ix_users_email'), table_name='users')
    op.drop_table('users')
