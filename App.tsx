import 'react-native-gesture-handler';
import React, { useMemo, useState } from 'react';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import {
  ScrollView,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
  Switch,
  Image,
  Platform,
} from 'react-native';

const palette = {
  bg: '#dfeae5',
  panel: '#f6faf7',
  panelAlt: '#edf3ef',
  border: '#c5d4cd',
  text: '#1b2d2a',
  muted: '#4a5e5b',
  secondary: '#2b8d7a',
  primary: '#0d7a6c',
  primaryDeep: '#0e6e63',
  accent: '#46c0b8',
  teal: '#0d8c86',
  dark: '#0d2e37',
  white: '#fff',
  red: '#d3646f',
  redLight: '#f5dfe0',
  greenLight: '#dff5f0',
  green: '#0d8c86',
  aqua: '#76d7d0',
  gray: '#d9e6e0',
  pink: '#f3dfe0',
  shadow: 'rgba(21, 42, 39, 0.15)',
};

type Exercise = {
  id: string;
  name: string;
  description: string;
  bodyPart: string;
  equipment: string;
  difficulty: string;
  duration: string;
  calories: string;
  level: string;
  instructions: string[];
  tip: string;
  state?: 'loaded' | 'loading' | 'offline';
};

type WorkoutHistoryItem = {
  id: string;
  title: string;
  category: string;
  subtitle: string;
  time: string;
  accent: string;
  duration: string;
  metricLabel: string;
  metricValue: string;
  status: 'strength' | 'cardio' | 'mobility';
};

const exercises: Exercise[] = [
  {
    id: 'barbell-squat',
    name: 'Barbell Squat',
    description: 'Compound lower body exercise focusing on quads and glutes.',
    bodyPart: 'Legs',
    equipment: 'Barbell',
    difficulty: 'Intermediate',
    duration: '30s',
    calories: '15 cal',
    level: 'Beginner',
    state: 'loaded',
    instructions: [
      'Set your feet shoulder-width apart and brace your core.',
      'Descend by bending your knees and hips while keeping your chest tall.',
      'Drive through your heels to return to the starting position.'
    ],
    tip: 'Keep your back flat and your knees tracking over your toes.'
  },
  {
    id: 'push-up',
    name: 'Push-up',
    description: 'Fundamental bodyweight exercise for chest, shoulders, and triceps.',
    bodyPart: 'Chest',
    equipment: 'Bodyweight',
    difficulty: 'Beginner',
    duration: '30s',
    calories: '15 cal',
    level: 'Beginner',
    state: 'loaded',
    instructions: [
      'Start in a high plank with hands under shoulders and body in one line.',
      'Lower yourself until your chest nearly touches the floor, then press up.',
      'Keep your core tight and your neck neutral throughout the movement.'
    ],
    tip: 'Keep your elbows tucked closer to your body to target triceps more.'
  },
  {
    id: 'dumbbell-curl',
    name: 'Dumbbell Curl',
    description: 'Isolation movement targeting the biceps brachii.',
    bodyPart: 'Arms',
    equipment: 'Dumbbell',
    difficulty: 'Beginner',
    duration: '20s',
    calories: '12 cal',
    level: 'Beginner',
    state: 'loaded',
    instructions: [
      'Stand tall with a dumbbell in each hand and palms facing forward.',
      'Curl the weights upward while keeping elbows close to your ribcage.',
      'Lower slowly and repeat for the prescribed number of reps.'
    ],
    tip: 'Control the lowering phase to keep tension on the biceps.'
  },
  {
    id: 'plank',
    name: 'Plank',
    description: 'Isometric core strengthening exercise.',
    bodyPart: 'Core',
    equipment: 'Bodyweight',
    difficulty: 'Intermediate',
    duration: '45s',
    calories: '10 cal',
    level: 'Beginner',
    state: 'offline',
    instructions: [
      'Get into a forearm plank with your body in a straight line.',
      'Engage your core and glutes to keep your hips from sagging.',
      'Hold the position without letting your shoulders collapse.'
    ],
    tip: 'Think of lengthening through your spine while keeping the ribs down.'
  },
  {
    id: 'dumbbell-bench-press',
    name: 'Dumbbell Bench Press',
    description: 'Classic chest pressing movement with dumbbells.',
    bodyPart: 'Chest',
    equipment: 'Dumbbells',
    difficulty: 'Intermediate',
    duration: '45s',
    calories: '20 cal',
    level: 'Intermediate',
    state: 'loading',
    instructions: [
      'Sit at the end of a flat bench with a dumbbell in each hand.',
      'Lie back and bring the dumbbells to shoulder level with palms facing forward.',
      'Press the dumbbells upward until your arms are fully extended.'
    ],
    tip: 'Keep the dumbbells in a slight arc to maintain chest activation.'
  }
];

const historicWorkouts: WorkoutHistoryItem[] = [
  {
    id: 'full-body-power',
    title: 'Full Body Power',
    category: 'Strength Training',
    subtitle: 'Strength',
    time: '07:30 AM',
    accent: '#c7efe4',
    duration: '55m',
    metricLabel: 'Volume',
    metricValue: '4,200kg',
    status: 'strength',
  },
  {
    id: 'morning-5k',
    title: 'Morning 5K',
    category: 'Cardio • Outdoor',
    subtitle: 'Cardio',
    time: '06:15 AM',
    accent: '#f5dfe0',
    duration: '28m',
    metricLabel: 'Distance',
    metricValue: '5.1 km',
    status: 'cardio',
  },
  {
    id: 'active-recovery',
    title: 'Active Recovery',
    category: 'Mobility & Yoga',
    subtitle: 'Mobility',
    time: '05:00 PM',
    accent: '#d8eff0',
    duration: '30m',
    metricLabel: 'Calories',
    metricValue: '120 kcal',
    status: 'mobility',
  },
];

type RootStackParamList = {
  SignIn: undefined;
  ProfileSetup: undefined;
  Main: undefined;
  ExerciseDetail: { exercise: Exercise; state?: 'loaded' | 'loading' | 'offline' };
};

type BottomTabParamList = {
  Home: undefined;
  Library: undefined;
  Log: undefined;
  History: undefined;
  Profile: undefined;
};

const RootStack = createStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<BottomTabParamList>();

function SignUpLoginScreen({ navigation }: { navigation: any }) {
  return (
    <View style={styles.screenShell}>
      <View style={styles.authContainer}>
        <Text style={styles.brand}>FitTrack</Text>
        <Text style={styles.authTitle}>Ready to start your fitness journey?</Text>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Email Address</Text>
          <View style={styles.inputRow}>
            <Ionicons name="mail-outline" size={20} color={palette.primary} />
            <TextInput value="you@example.com" style={styles.inputText} placeholderTextColor="#6b7d78" />
          </View>
        </View>

        <View style={styles.inputGroup}>
          <View style={styles.passwordRow}>
            <Text style={styles.label}>Password</Text>
            <Text style={styles.linkText}>Forgot?</Text>
          </View>
          <View style={styles.inputRow}>
            <Ionicons name="lock-closed-outline" size={20} color={palette.primary} />
            <TextInput value="••••••••" style={styles.inputText} secureTextEntry placeholderTextColor="#6b7d78" />
          </View>
        </View>

        <Pressable style={styles.primaryButton} onPress={() => navigation.navigate('ProfileSetup')}>
          <Text style={styles.primaryButtonText}>Let&apos;s Go →</Text>
        </Pressable>
      </View>
    </View>
  );
}

function ProfileSetupScreen({ navigation }: { navigation: any }) {
  const [selectedGoal, setSelectedGoal] = useState('Lose Weight');
  const [sex, setSex] = useState('Male');

  return (
    <View style={styles.screenShell}>
      <View style={styles.contentWrap}>
        <View style={styles.avatarWrap}>
          <View style={styles.avatarBubble}>
            <Ionicons name="add-outline" size={34} color={palette.white} />
          </View>
        </View>

        <Text style={styles.formTitle}>Tell us about yourself</Text>
        <Text style={styles.formSubtitle}>Let&apos;s customize your FitTrack experience.</Text>

        <View style={styles.twoColRow}>
          <View style={styles.fieldBox}>
            <Text style={styles.fieldLabel}>HEIGHT</Text>
            <TextInput value="175" style={styles.fieldInput} />
            <Text style={styles.fieldUnit}>cm</Text>
          </View>
          <View style={styles.fieldBox}>
            <Text style={styles.fieldLabel}>WEIGHT</Text>
            <TextInput value="70" style={styles.fieldInput} />
            <Text style={styles.fieldUnit}>kg</Text>
          </View>
        </View>

        <View style={styles.fieldBoxWide}>
          <Text style={styles.fieldLabel}>AGE</Text>
          <TextInput value="e.g. 28" style={styles.fieldInputWide} />
        </View>

        <View style={styles.fieldBoxWide}>
          <Text style={styles.fieldLabel}>BIOLOGICAL SEX</Text>
          <View style={styles.segmentedRow}>
            {['Male', 'Female', 'Other'].map((option) => (
              <Pressable
                key={option}
                style={[styles.segmentButton, sex === option && styles.segmentButtonSelected]}
                onPress={() => setSex(option)}
              >
                <Text style={[styles.segmentText, sex === option && styles.segmentTextSelected]}>{option}</Text>
              </Pressable>
            ))}
          </View>
        </View>

        <View style={styles.fieldBoxWide}>
          <Text style={styles.fieldLabel}>PRIMARY GOAL</Text>
          {['Lose Weight', 'Build Muscle', 'Improve Endurance'].map((goal) => (
            <Pressable
              key={goal}
              style={[styles.goalRow, selectedGoal === goal && styles.goalRowSelected]}
              onPress={() => setSelectedGoal(goal)}
            >
              <Ionicons name={goal === selectedGoal ? 'radio-button-on' : 'radio-button-off'} size={20} color={palette.primary} />
              <Text style={styles.goalText}>{goal}</Text>
            </Pressable>
          ))}
        </View>

        <Pressable style={styles.primaryButtonLarge} onPress={() => navigation.navigate('Main')}>
          <Text style={styles.primaryButtonText}>Continue</Text>
        </Pressable>
      </View>
    </View>
  );
}

function DashboardScreen() {
  const steps = '8,432';
  return (
    <View style={styles.screenShellDark}>
      <View style={styles.appHeader}>
        <Ionicons name="menu-outline" size={30} color={palette.primary} />
        <Text style={styles.titleText}>FitTrack</Text>
        <Ionicons name="notifications-outline" size={26} color={palette.primary} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <Text style={styles.greeting}>Good Morning, Alex!</Text>
        <Text style={styles.greetingSub}>Ready to crush your goals today?</Text>

        <View style={styles.largeCard}>
          <View style={styles.cardHeaderRow}>
            <Text style={styles.cardTitle}>Daily Steps</Text>
            <Ionicons name="walk-outline" size={26} color={palette.primary} />
          </View>
          <View style={styles.circularMeter}>
            <Text style={styles.metricText}>{steps}</Text>
            <Text style={styles.metricSub}>/ 10,000</Text>
          </View>
          <Text style={styles.cardCaption}>You&apos;re almost there! Keep moving.</Text>
        </View>

        <View style={styles.largeCard}>
          <View style={styles.cardHeaderRow}>
            <Text style={styles.cardTitle}>Weekly Workouts</Text>
            <Ionicons name="barbell-outline" size={26} color={palette.primary} />
          </View>
          <Text style={styles.workoutCount}>3 <Text style={styles.mutedText}>/ 5 completed</Text></Text>
          <View style={styles.progressTrack}>
            <View style={[styles.progressFill, { width: '60%' }]} />
          </View>
          <View style={styles.weekLabelRow}>
            <Text>Mon</Text>
            <Text>Sun</Text>
          </View>
        </View>

        <View style={styles.statsRow}>
          <View style={styles.statCardTeal}>
            <Text style={styles.statTitle}>Calories Burned</Text>
            <Text style={styles.statValue}>1,240</Text>
            <Text style={styles.statMeta}>KCAL</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statTitle}>Active Time</Text>
            <Text style={styles.statValue}>45m</Text>
            <Text style={styles.statMeta}>+5m vs yesterday</Text>
          </View>
        </View>

        <View style={styles.historyCard}>
          <View style={styles.cardHeaderRow}>
            <Text style={styles.cardTitle}>Step History</Text>
            <Ionicons name="ellipsis-horizontal" size={26} color={palette.primary} />
          </View>
          <Text style={styles.historyMeta}>Last 7 days performance</Text>
        </View>
      </ScrollView>

      <View style={styles.fabWrap}>
        <Pressable style={styles.fabButton}><Ionicons name="add" size={32} color={palette.white} /></Pressable>
      </View>
    </View>
  );
}

function ExerciseLibraryScreen({ navigation }: { navigation: any }) {
  const [filter, setFilter] = useState('All');

  const filteredExercises = filter === 'All' ? exercises : exercises.filter((item) => item.bodyPart === filter || item.equipment === filter);

  return (
    <View style={styles.screenShell}>
      <View style={styles.appHeader}>
        <Ionicons name="menu-outline" size={30} color={palette.primary} />
        <Text style={styles.titleText}>FitTrack</Text>
        <Ionicons name="notifications-outline" size={26} color={palette.primary} />
      </View>

      <View style={styles.searchWrap}>
        <Ionicons name="search-outline" size={24} color={palette.primary} style={styles.searchIcon} />
        <TextInput value="Search exercises..." style={styles.searchInput} />
      </View>

      <View style={styles.chipRow}>
        {['All', 'Body Part', 'Equipment', 'Difficulty'].map((option) => (
          <Pressable
            key={option}
            style={[styles.chip, filter === option && styles.chipSelected]}
            onPress={() => setFilter(option)}
          >
            <Text style={[styles.chipText, filter === option && styles.chipTextSelected]}>{option}</Text>
          </Pressable>
        ))}
      </View>

      <ScrollView contentContainerStyle={styles.libraryList} showsVerticalScrollIndicator={false}>
        {filteredExercises.map((item) => (
          <Pressable
            key={item.id}
            style={styles.exerciseCard}
            onPress={() => navigation.navigate('ExerciseDetail', { exercise: item, state: item.state ?? 'loaded' })}
          >
            <View style={styles.exerciseThumb}>
              <MaterialCommunityIcons name={item.id.includes('squat') ? 'weight-lifter' : item.id.includes('push') ? 'dumbbell' : item.id.includes('curl') ? 'arm-flex' : 'yoga'} size={56} color={palette.primary} />
            </View>
            <View style={styles.exerciseCopy}>
              <Text style={styles.exerciseTitle}>{item.name}</Text>
              <Text style={styles.exerciseDescription}>{item.description}</Text>
              <View style={styles.tagRow}>
                <Text style={styles.tag}>{item.bodyPart}</Text>
                <Text style={styles.tag}>{item.equipment}</Text>
              </View>
            </View>
            <View style={styles.statusDot} />
          </Pressable>
        ))}
      </ScrollView>
    </View>
  );
}

function ExerciseDetailScreen({ route }: { route: any }) {
  const { exercise, state = 'loaded' } = route.params;

  if (state === 'loading') {
    return (
      <View style={styles.screenShell}>
        <View style={styles.detailHeader}>
          <Ionicons name="arrow-back" size={28} color={palette.primary} />
          <Text style={styles.titleText}>Exercise Detail</Text>
          <Ionicons name="ellipsis-vertical" size={26} color={palette.primary} />
        </View>
        <View style={styles.skeletonWrap}>
          <View style={styles.placeholderImage}>
            <Ionicons name="image-outline" size={46} color={palette.muted} />
          </View>
          <View style={styles.skeletonLineShort} />
          <View style={styles.skeletonLineLong} />
          <View style={styles.skeletonLineLonger} />
          <View style={styles.skeletonLineShort} />
        </View>
      </View>
    );
  }

  if (state === 'offline') {
    return (
      <View style={styles.screenShell}>
        <View style={styles.detailHeader}>
          <Ionicons name="arrow-back" size={28} color={palette.primary} />
          <Text style={styles.titleText}>Exercise Detail</Text>
          <Ionicons name="ellipsis-vertical" size={26} color={palette.primary} />
        </View>

        <View style={styles.offlinePanel}>
          <View style={styles.offlineBadge}><Ionicons name="ban-outline" size={30} color={palette.primary}/></View>
          <Text style={styles.offlineTitle}>Preview unavailable offline</Text>
          <Text style={styles.offlineText}>This exercise hasn&apos;t been cached yet. Connect to the internet to download media.</Text>
        </View>

        <View style={styles.detailMetaGrid}>
          <View style={styles.metaCard}><Ionicons name="fitness-outline" size={24} color={palette.primary} /><Text style={styles.metaLabel}>TARGET</Text><Text style={styles.metaValue}>{exercise.bodyPart}</Text></View>
          <View style={styles.metaCard}><MaterialCommunityIcons name="dumbbell" size={24} color={palette.primary} /><Text style={styles.metaLabel}>EQUIPMENT</Text><Text style={styles.metaValue}>{exercise.equipment}</Text></View>
        </View>
        <View style={styles.detailMetaGrid}>
          <View style={styles.metaCard}><Ionicons name="speedometer-outline" size={22} color={palette.primary} /><Text style={styles.metaLabel}>DIFFICULTY</Text><Text style={styles.metaValue}>{exercise.difficulty}</Text></View>
          <View style={styles.metaCard}><Ionicons name="barbell-outline" size={22} color={palette.primary} /><Text style={styles.metaLabel}>YOUR PR</Text><Text style={styles.metaValue}>80 lbs × 5</Text></View>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.screenShell}>
      <View style={styles.detailHeader}>
        <Ionicons name="arrow-back" size={28} color={palette.primary} />
        <Text style={styles.titleText}>Exercise Detail</Text>
        <Ionicons name="ellipsis-vertical" size={26} color={palette.primary} />
      </View>

      <View style={styles.detailImageWrap}>
        <View style={styles.detailPhoto}>
          <View style={styles.playButton}><Ionicons name="play" size={34} color={palette.white} /></View>
        </View>
      </View>

      <View style={styles.detailTopRow}>
        <Text style={styles.detailName}>{exercise.name}</Text>
        <View style={styles.badgeGreen}><Ionicons name="cloud-done-outline" size={18} color={palette.primary} /></View>
      </View>
      <View style={styles.detailTagsRow}>
        <View style={styles.inlineTag}><Ionicons name="fitness-outline" size={16} color={palette.primary} /><Text style={styles.inlineTagText}>{exercise.bodyPart}</Text></View>
        <View style={styles.inlineTag}><Text style={styles.inlineTagText}>{exercise.equipment}</Text></View>
        <View style={styles.inlineTag}><Ionicons name="wifi-outline" size={16} color={palette.primary} /><Text style={styles.inlineTagText}>Offline Ready</Text></View>
      </View>

      <View style={styles.statsBar}>
        <View style={styles.statBox}><Ionicons name="time-outline" size={22} color={palette.primary} /><Text style={styles.statBoxLabel}>DURATION</Text><Text style={styles.statBoxValue}>{exercise.duration}</Text></View>
        <View style={styles.statBox}><Ionicons name="flame-outline" size={22} color={palette.primary} /><Text style={styles.statBoxLabel}>BURN</Text><Text style={styles.statBoxValue}>{exercise.calories}</Text></View>
        <View style={styles.statBox}><Ionicons name="bar-chart-outline" size={22} color={palette.primary} /><Text style={styles.statBoxLabel}>LEVEL</Text><Text style={styles.statBoxValue}>{exercise.level}</Text></View>
      </View>

      <Text style={styles.instructionsTitle}>Instructions</Text>
      {exercise.instructions.map((step: string, idx: number) => (
        <View key={idx} style={styles.instructionItem}>
          <View style={styles.stepCircle}>{idx + 1}</View>
          <Text style={styles.instructionText}>{step}</Text>
        </View>
      ))}

      <View style={styles.tipCard}>
        <Ionicons name="bulb-outline" size={22} color={palette.red} />
        <Text style={styles.tipText}>{exercise.tip}</Text>
      </View>

      <Pressable style={styles.primaryButtonLargeBottom}>
        <Text style={styles.primaryButtonText}>Log this exercise</Text>
      </Pressable>
    </View>
  );
}

function LogWorkoutScreen() {
  return (
    <View style={styles.screenShell}>
      <View style={styles.appHeader}>
        <Ionicons name="close-outline" size={30} color={palette.primary} />
        <Text style={styles.titleText}>FitTrack</Text>
      </View>

      <View style={styles.logWrap}>
        <Text style={styles.logIntroTitle}>Log Workout</Text>
        <Text style={styles.logIntroSub}>Record your sets, reps, and efforts.</Text>

        <View style={styles.logSectionHeader}>
          <Text style={styles.sectionHeading}>Today</Text>
          <Text style={styles.linkText}>Edit</Text>
        </View>

        <View style={styles.inputGroupLog}>
          <Text style={styles.labelBox}>EXERCISE</Text>
          <View style={styles.searchWrapLog}>
            <Ionicons name="search-outline" size={22} color={palette.primary} style={styles.searchIcon} />
            <TextInput value="Search exercises (e.g. Bench Pre)" style={styles.logInput} />
          </View>
          <View style={styles.tagShortRow}><Text style={styles.tagShort}>Squat</Text><Text style={styles.tagShort}>Deadlift</Text><Text style={styles.tagShort}>Pull-up</Text></View>
        </View>

        <View style={styles.setsRow}>
          <View style={styles.setCircle}>1</View>
          <View style={styles.setCell}><Text style={styles.setCellLabel}>SET</Text><Text style={styles.setCellValue}>1</Text></View>
          <View style={styles.setCell}><Text style={styles.setCellLabel}>REPS</Text><Text style={styles.setCellValue}>0</Text></View>
          <View style={styles.setCell}><Text style={styles.setCellLabel}>WEIGHT</Text><Text style={styles.setCellValue}>0.0</Text></View>
          <Ionicons name="trash-outline" size={22} color={palette.primary} />
        </View>

        <View style={styles.setsRow}>
          <View style={styles.setCircle}>2</View>
          <View style={styles.setCell}><Text style={styles.setCellLabel}>SET</Text><Text style={styles.setCellValue}>2</Text></View>
          <View style={styles.setCell}><Text style={styles.setCellLabel}>REPS</Text><Text style={styles.setCellValue}>0</Text></View>
          <View style={styles.setCell}><Text style={styles.setCellLabel}>WEIGHT</Text><Text style={styles.setCellValue}>0.0</Text></View>
          <Ionicons name="trash-outline" size={22} color={palette.primary} />
        </View>

        <View style={styles.addSetBox}><Ionicons name="add-circle-outline" size={20} color={palette.primary} /><Text style={styles.addSetText}>Add Set</Text></View>

        <View style={styles.durationCard}>
          <Text style={styles.labelBox}>DURATION (MINUTES)</Text>
          <View style={styles.searchWrapLog}>
            <Ionicons name="time-outline" size={20} color={palette.primary} style={styles.searchIcon} />
            <TextInput value="e.g. 45" style={styles.logInput} />
          </View>
        </View>

        <Pressable style={styles.primaryButtonSave}><Text style={styles.primaryButtonText}>Save Workout</Text></Pressable>
      </View>
    </View>
  );
}

function MyGoalsScreen() {
  return (
    <View style={styles.screenShell}>
      <View style={styles.appHeader}>
        <Ionicons name="menu-outline" size={30} color={palette.primary} />
        <Text style={styles.titleText}>FitTrack</Text>
        <Ionicons name="notifications-outline" size={26} color={palette.primary} />
      </View>

      <Text style={styles.sectionHeadingLarge}>Your Goals</Text>
      <Text style={styles.goalsIntro}>Adjust your targets and track your progress.</Text>

      <View style={styles.goalPanel}>
        <View style={styles.goalPanelHeader}><Ionicons name="walk-outline" size={26} color={palette.primary} /><Text style={styles.goalPanelLabel}>Daily Steps</Text><View style={styles.goalBadge}>Target</View></View>
        <Text style={styles.goalBig}>8,500</Text>
        <Text style={styles.goalSmall}>steps/day</Text>
        <View style={styles.goalSlider}><View style={styles.sliderThumb}/></View>
        <View style={styles.goalRange}><Text>1k</Text><Text>20k</Text></View>
        <Text style={styles.goalSubline}>Today&apos;s Progress <Text style={styles.goalSubValue}>8,240 / 8,500</Text></Text>
        <View style={styles.progressTrackSmall}><View style={[styles.progressFillSmall, { width: '97%' }]} /></View>
        <Text style={styles.goalTip}><Ionicons name="sparkles-outline" size={18} color={palette.primary} /> Keep it up, you&apos;re almost there!</Text>
      </View>

      <View style={styles.goalPanelPink}>
        <View style={styles.goalPanelHeader}><Ionicons name="barbell-outline" size={26} color={palette.primary} /><Text style={styles.goalPanelLabel}>Weekly Workouts</Text><View style={styles.goalBadgePink}>Target</View></View>
        <Text style={styles.goalBig}>4</Text>
        <Text style={styles.goalSmall}>sessions/week</Text>
        <View style={styles.goalSlider}><View style={styles.sliderThumb}/></View>
        <View style={styles.goalRange}><Text>1</Text><Text>7</Text></View>
        <Text style={styles.goalSubline}>This Week&apos;s Progress <Text style={styles.goalSubValue}>3 / 4</Text></Text>
        <View style={styles.progressTrackSmall}><View style={[styles.progressFillSmallPink, { width: '75%' }]} /></View>
        <Text style={styles.goalTip}><Ionicons name="sparkles-outline" size={18} color={palette.primary} /> One more session to hit your goal!</Text>
      </View>

      <View style={styles.calloutCard}>
        <Text style={styles.calloutTitle}>Ready to crush it?</Text>
        <Text style={styles.calloutText}>Setting consistent goals is the key to long-term success. Your current targets align perfectly with a balanced lifestyle.</Text>
        <Pressable style={styles.primaryButtonLarge}><Text style={styles.primaryButtonText}>Save Goals</Text></Pressable>
      </View>
    </View>
  );
}

function WorkoutHistoryScreen() {
  return (
    <View style={styles.screenShell}>
      <View style={styles.appHeader}>
        <Ionicons name="menu-outline" size={30} color={palette.primary} />
        <Text style={styles.titleText}>FitTrack</Text>
        <Ionicons name="notifications-outline" size={26} color={palette.primary} />
      </View>

      <Text style={styles.sectionHeadingLarge}>Workout History</Text>
      <Text style={styles.goalsIntro}>Review your past performance and stay on track.</Text>

      <View style={styles.monthPanel}>
        <Text style={styles.monthTitle}>June 2023</Text>
        <View style={styles.monthControls}><Ionicons name="chevron-back" size={26} color={palette.primary} /><Ionicons name="chevron-forward" size={26} color={palette.primary} /></View>
        <View style={styles.daysRow}>
          {['M', 'T', 'W', 'T', 'F', 'S'].map((day, idx) => (
            <View key={day + idx} style={styles.dayCell}><Text style={styles.dayWord}>{day}</Text><Text style={[styles.dayNumber, idx === 1 && styles.daySelected]}>{12 + idx}</Text></View>
          ))}
        </View>
      </View>

      {historicWorkouts.map((workout) => (
        <View key={workout.id} style={styles.historyWorkoutRow}>
          <View style={[styles.workoutBadge, { backgroundColor: workout.accent }]}><Ionicons name={workout.status === 'strength' ? 'barbell-outline' : workout.status === 'cardio' ? 'walk-outline' : 'sunny-outline'} size={22} color={palette.primary} /></View>
          <View style={styles.historyWorkoutContent}>
            <View style={styles.historyHeaderRow}><Text style={styles.historyTitle}>{workout.title}</Text><Text style={styles.historyTime}>{workout.time}</Text></View>
            <Text style={styles.historySubtitle}>{workout.category}</Text>
            <View style={styles.historyMetricRow}>
              <View style={styles.metricCol}><Text style={styles.metricKey}>DURATION</Text><Text style={styles.metricValueText}>{workout.duration}</Text></View>
              <View style={styles.metricCol}><Text style={styles.metricKey}>{workout.metricLabel.toUpperCase()}</Text><Text style={styles.metricValueText}>{workout.metricValue}</Text></View>
              <View style={styles.metricCol}><Text style={styles.metricKey}>RECORDS</Text><Text style={styles.metricValueText}>2</Text></View>
            </View>
          </View>
        </View>
      ))}
    </View>
  );
}

function ProfileSettingsScreen() {
  return (
    <View style={styles.screenShell}>
      <View style={styles.appHeader}>
        <Ionicons name="menu-outline" size={30} color={palette.primary} />
        <Text style={styles.titleText}>FitTrack</Text>
        <Ionicons name="notifications-outline" size={26} color={palette.primary} />
      </View>

      <View style={styles.profileHeaderWrap}>
        <View style={styles.profileAvatarBack}><Ionicons name="person-outline" size={54} color={palette.primary} /></View>
        <Text style={styles.profileName}>Alex Fitness</Text>
        <Text style={styles.profileEmail}>alex.fitness@example.com</Text>
      </View>

      <View style={styles.settingsCard}>
        <Text style={styles.settingsTitle}>Personal Information</Text>
        <Text style={styles.labelRow}>Full Name</Text>
        <View style={styles.settingsInput}><Ionicons name="person-outline" size={20} color={palette.primary} /><Text style={styles.settingsValue}>Alex Fitness</Text></View>
        <Text style={styles.labelRow}>Email Address</Text>
        <View style={styles.settingsInput}><Ionicons name="mail-outline" size={20} color={palette.primary} /><Text style={styles.settingsValue}>alex.fitness@example.com</Text></View>
        <Pressable style={styles.primaryButtonLarge}><Text style={styles.primaryButtonText}>Save Changes</Text></Pressable>
      </View>

      <View style={styles.settingsCard}>
        <Text style={styles.settingsTitle}>App Preferences</Text>
        <View style={styles.prefRow}><Ionicons name="notifications-outline" size={24} color={palette.primary} /><Text style={styles.prefLabel}>Push Notifications</Text><Switch value={true} /></View>
        <View style={styles.prefRow}><Ionicons name="bar-chart-outline" size={24} color={palette.primary} /><Text style={styles.prefLabel}>Measurement</Text><Text style={styles.prefSelect}>Metric (kg, km)</Text></View>
      </View>

      <View style={styles.settingsCardMargin}>
        <Text style={styles.settingsTitle}>Account Security</Text>
        <Text style={styles.securityText}>Manage your account security and authentication methods.</Text>
        <View style={styles.prefRow}><Ionicons name="lock-closed-outline" size={22} color={palette.primary} /><Text style={styles.prefLabel}>Change Password</Text></View>
      </View>
    </View>
  );
}

function CustomTabBar({ state, navigation }: { state: any; navigation: any }) {
  const tabs: Array<{ key: keyof BottomTabParamList; icon: any; label: string }> = [
    { key: 'Home', icon: 'home-outline', label: 'Home' },
    { key: 'Library', icon: 'barbell-outline', label: 'Library' },
    { key: 'Log', icon: 'add-circle-outline', label: 'Log' },
    { key: 'History', icon: 'time-outline', label: 'History' },
    { key: 'Profile', icon: 'person-outline', label: 'Profile' },
  ];

  return (
    <View style={styles.tabBarWrap}>
      {tabs.map((tab, index) => {
        const isFocused = state.index === index;
        const iconName: any = tab.key === 'Log' ? 'add-circle' : tab.icon;
        const onPress = () => navigation.navigate(tab.key);

        if (tab.key === 'Log') {
          return (
            <Pressable key={tab.key} onPress={onPress} style={[styles.logTabButton, isFocused && styles.logTabSelected]}>
              <Ionicons name={iconName} size={34} color={isFocused ? palette.white : palette.primary} />
            </Pressable>
          );
        }

        return (
          <Pressable key={tab.key} onPress={onPress} style={styles.tabItem}>
            <Ionicons name={iconName} size={24} color={isFocused ? palette.primary : palette.muted} />
            <Text style={[styles.tabLabel, isFocused && styles.tabLabelActive]}>{tab.label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={{ headerShown: false }}
      tabBar={(props) => <CustomTabBar {...props} />}
    >
      <Tab.Screen name="Home" component={DashboardScreen} />
      <Tab.Screen name="Library" component={ExerciseLibraryScreen} />
      <Tab.Screen name="Log" component={LogWorkoutScreen} />
      <Tab.Screen name="History" component={WorkoutHistoryScreen} />
      <Tab.Screen name="Profile" component={ProfileSettingsScreen} />
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <RootStack.Navigator initialRouteName="SignIn" screenOptions={{ headerShown: false }}>
          <RootStack.Screen name="SignIn" component={SignUpLoginScreen} />
          <RootStack.Screen name="ProfileSetup" component={ProfileSetupScreen} />
          <RootStack.Screen name="Main" component={MainTabs} />
          <RootStack.Screen name="ExerciseDetail" component={ExerciseDetailScreen} />
        </RootStack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  screenShell: {
    flex: 1,
    backgroundColor: palette.bg,
    paddingHorizontal: 0,
  },
  screenShellDark: {
    flex: 1,
    backgroundColor: '#0c1f21',
    paddingHorizontal: 0,
  },
  contentWrap: {
    flex: 1,
    paddingHorizontal: 20,
    backgroundColor: palette.bg,
  },
  authContainer: {
    flex: 1,
    backgroundColor: palette.bg,
    paddingHorizontal: 24,
    paddingTop: 32,
    justifyContent: 'center',
  },
  brand: {
    fontSize: 42,
    fontWeight: '700',
    color: palette.primary,
    letterSpacing: -1,
    textAlign: 'center',
    marginBottom: 12,
  },
  authTitle: {
    fontSize: 28,
    color: palette.primary,
    textAlign: 'center',
    lineHeight: 36,
    marginBottom: 18,
    fontWeight: '400',
  },
  inputGroup: {
    marginBottom: 18,
  },
  label: {
    fontSize: 16,
    color: palette.primary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 8,
    fontWeight: '700',
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: palette.border,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.3)',
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  inputText: {
    flex: 1,
    fontSize: 18,
    color: palette.text,
    marginLeft: 10,
  },
  passwordRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  linkText: {
    color: palette.primary,
    fontWeight: '700',
  },
  primaryButton: {
    backgroundColor: palette.primaryDeep,
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 10,
    shadowColor: palette.shadow,
    shadowOpacity: 0.2,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 4,
  },
  primaryButtonText: {
    color: palette.white,
    fontSize: 24,
    fontWeight: '700',
  },
  primaryButtonLarge: {
    backgroundColor: palette.primaryDeep,
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 16,
    width: '100%',
  },
  primaryButtonLargeBottom: {
    backgroundColor: palette.primaryDeep,
    borderRadius: 14,
    paddingVertical: 18,
    alignItems: 'center',
    marginTop: 14,
    marginBottom: 20,
  },
  primaryButtonSave: {
    backgroundColor: palette.primaryDeep,
    borderRadius: 14,
    paddingVertical: 18,
    alignItems: 'center',
    marginTop: 22,
  },
  avatarWrap: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 12,
    marginBottom: 18,
  },
  avatarBubble: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: palette.secondary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  formTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: palette.text,
    marginBottom: 4,
    textAlign: 'center',
  },
  formSubtitle: {
    textAlign: 'center',
    color: palette.muted,
    fontSize: 18,
    marginBottom: 20,
  },
  twoColRow: {
    flexDirection: 'row',
    gap: 14,
    marginBottom: 18,
  },
  fieldBox: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.25)',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: palette.border,
    padding: 12,
    position: 'relative',
  },
  fieldBoxWide: {
    backgroundColor: 'rgba(255,255,255,0.25)',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: palette.border,
    padding: 12,
    marginBottom: 18,
  },
  fieldLabel: {
    fontSize: 14,
    color: palette.primary,
    letterSpacing: 0.8,
    fontWeight: '700',
    marginBottom: 8,
    textTransform: 'uppercase',
  },
  fieldInput: {
    fontSize: 28,
    color: palette.text,
    fontWeight: '500',
  },
  fieldInputWide: {
    fontSize: 22,
    color: palette.text,
    paddingVertical: 4,
  },
  fieldUnit: {
    position: 'absolute',
    right: 12,
    bottom: 12,
    fontSize: 18,
    color: palette.muted,
  },
  segmentedRow: {
    flexDirection: 'row',
    gap: 10,
  },
  segmentButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: palette.border,
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
  },
  segmentButtonSelected: {
    backgroundColor: palette.primary,
    borderColor: palette.primary,
  },
  segmentText: {
    color: palette.text,
    fontSize: 16,
  },
  segmentTextSelected: {
    color: palette.white,
    fontWeight: '700',
  },
  goalRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderWidth: 1,
    borderColor: palette.border,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 12,
    marginTop: 10,
  },
  goalRowSelected: {
    borderColor: palette.primary,
  },
  goalText: {
    fontSize: 18,
    color: palette.text,
  },
  appHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 18,
    paddingTop: 12,
    paddingBottom: 8,
    backgroundColor: palette.panel,
  },
  titleText: {
    fontSize: 36,
    fontWeight: '700',
    color: palette.primary,
  },
  greeting: {
    marginTop: 12,
    fontSize: 26,
    fontWeight: '700',
    color: palette.text,
  },
  greetingSub: {
    fontSize: 20,
    color: palette.text,
    marginBottom: 18,
  },
  largeCard: {
    backgroundColor: 'rgba(255,255,255,0.55)',
    borderRadius: 26,
    padding: 18,
    marginBottom: 18,
    borderWidth: 1,
    borderColor: palette.border,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  cardTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: palette.text,
  },
  circularMeter: {
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    width: 220,
    height: 220,
    borderRadius: 110,
    borderWidth: 8,
    borderColor: '#d9dfe3',
    marginVertical: 12,
  },
  metricText: {
    fontSize: 42,
    fontWeight: '700',
    color: palette.text,
  },
  metricSub: {
    fontSize: 20,
    color: palette.muted,
  },
  cardCaption: {
    fontSize: 20,
    color: palette.text,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  workoutCount: {
    fontSize: 28,
    color: palette.text,
    marginVertical: 10,
  },
  mutedText: {
    fontSize: 20,
    color: palette.muted,
  },
  progressTrack: {
    height: 12,
    backgroundColor: '#d7e4e1',
    borderRadius: 999,
    overflow: 'hidden',
    marginVertical: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: palette.primary,
    borderRadius: 999,
  },
  weekLabelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    color: palette.muted,
    marginTop: 8,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 18,
  },
  statCardTeal: {
    flex: 1,
    backgroundColor: '#5db8ac',
    borderRadius: 18,
    padding: 16,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#e9f5f2',
    borderRadius: 18,
    padding: 16,
  },
  statTitle: {
    fontSize: 18,
    color: palette.text,
    textTransform: 'none',
  },
  statValue: {
    fontSize: 34,
    fontWeight: '700',
    color: palette.text,
    marginTop: 4,
  },
  statMeta: {
    fontSize: 14,
    color: palette.muted,
    marginTop: 6,
  },
  historyCard: {
    backgroundColor: '#ecf0ee',
    borderRadius: 18,
    padding: 18,
    marginBottom: 90,
  },
  historyMeta: {
    color: palette.muted,
    fontSize: 18,
    marginTop: 8,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  fabWrap: {
    position: 'absolute',
    right: 16,
    bottom: 90,
  },
  fabButton: {
    width: 62,
    height: 62,
    borderRadius: 31,
    backgroundColor: palette.primary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: palette.shadow,
    shadowOpacity: 0.2,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
  },
  searchWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#eef3f1',
    borderRadius: 30,
    borderWidth: 1,
    borderColor: palette.border,
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginHorizontal: 18,
    marginTop: 10,
    marginBottom: 14,
  },
  searchInput: {
    flex: 1,
    fontSize: 18,
    color: palette.text,
    marginLeft: 10,
  },
  searchIcon: {
    opacity: 0.9,
  },
  chipRow: {
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 18,
    marginBottom: 14,
  },
  chip: {
    borderRadius: 999,
    borderWidth: 1,
    borderColor: palette.border,
    backgroundColor: '#edf3ef',
    paddingHorizontal: 18,
    paddingVertical: 10,
  },
  chipSelected: {
    backgroundColor: palette.secondary,
    borderColor: palette.secondary,
  },
  chipText: {
    fontSize: 18,
    color: palette.text,
    fontWeight: '500',
  },
  chipTextSelected: {
    color: palette.white,
    fontWeight: '700',
  },
  libraryList: {
    paddingHorizontal: 18,
    paddingBottom: 110,
  },
  exerciseCard: {
    flexDirection: 'row',
    backgroundColor: '#f2f6f4',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: palette.border,
    padding: 14,
    marginBottom: 16,
    alignItems: 'center',
  },
  exerciseThumb: {
    width: 92,
    height: 92,
    borderRadius: 18,
    backgroundColor: '#dfe9e4',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  exerciseCopy: {
    flex: 1,
  },
  exerciseTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: palette.text,
    marginBottom: 6,
  },
  exerciseDescription: {
    fontSize: 18,
    color: palette.muted,
    lineHeight: 24,
    marginBottom: 10,
  },
  tagRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 4,
  },
  tag: {
    backgroundColor: '#dfeae4',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 15,
    color: palette.text,
    fontWeight: '600',
  },
  statusDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#2f9d96',
    marginLeft: 10,
  },
  detailHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 18,
    paddingTop: 16,
    paddingBottom: 10,
    backgroundColor: palette.panel,
  },
  detailImageWrap: {
    paddingHorizontal: 18,
    marginTop: 10,
  },
  detailPhoto: {
    height: 220,
    borderRadius: 18,
    backgroundColor: '#d9e8e5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  playButton: {
    width: 86,
    height: 86,
    borderRadius: 43,
    backgroundColor: palette.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  detailTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 18,
    marginTop: 16,
    justifyContent: 'space-between',
  },
  detailName: {
    fontSize: 30,
    fontWeight: '700',
    color: palette.text,
  },
  badgeGreen: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: '#dfeae4',
    alignItems: 'center',
    justifyContent: 'center',
  },
  detailTagsRow: {
    flexDirection: 'row',
    gap: 10,
    paddingHorizontal: 18,
    marginTop: 12,
    flexWrap: 'wrap',
  },
  inlineTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#dfeae4',
    borderRadius: 999,
  },
  inlineTagText: {
    fontSize: 16,
    color: palette.text,
  },
  statsBar: {
    flexDirection: 'row',
    marginTop: 18,
    borderRadius: 12,
    backgroundColor: '#edf3ef',
    padding: 8,
    marginHorizontal: 18,
    gap: 8,
  },
  statBox: {
    flex: 1,
    backgroundColor: '#f4f7f5',
    borderRadius: 10,
    alignItems: 'center',
    paddingVertical: 14,
  },
  statBoxLabel: {
    fontSize: 12,
    color: palette.muted,
    marginTop: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  statBoxValue: {
    fontSize: 18,
    fontWeight: '700',
    color: palette.text,
    marginTop: 4,
  },
  instructionsTitle: {
    fontSize: 26,
    fontWeight: '700',
    marginTop: 18,
    marginLeft: 18,
    color: palette.text,
  },
  instructionItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#f4f7f5',
    borderRadius: 14,
    marginHorizontal: 18,
    marginTop: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: '#dfeae4',
  },
  stepCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: palette.primary,
    color: palette.white,
    textAlign: 'center',
    lineHeight: 32,
    fontWeight: '700',
    marginRight: 12,
    overflow: 'hidden',
  },
  instructionText: {
    flex: 1,
    fontSize: 18,
    color: palette.text,
    lineHeight: 26,
  },
  tipCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f4dfe0',
    borderRadius: 16,
    padding: 18,
    marginHorizontal: 18,
    marginTop: 18,
    gap: 12,
  },
  tipText: {
    flex: 1,
    fontSize: 18,
    color: palette.text,
    lineHeight: 28,
  },
  logWrap: {
    paddingHorizontal: 18,
    paddingTop: 14,
  },
  logIntroTitle: {
    fontSize: 26,
    color: palette.text,
    fontWeight: '700',
  },
  logIntroSub: {
    fontSize: 18,
    color: palette.muted,
    marginTop: 4,
    marginBottom: 16,
  },
  logSectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionHeading: {
    fontSize: 30,
    color: palette.text,
    fontWeight: '700',
  },
  inputGroupLog: {
    backgroundColor: '#edf4f2',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: palette.border,
    padding: 14,
    marginBottom: 18,
  },
  labelBox: {
    marginBottom: 10,
    fontSize: 14,
    color: palette.primary,
    letterSpacing: 0.7,
    textTransform: 'uppercase',
    fontWeight: '700',
  },
  searchWrapLog: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f4f6f4',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: palette.border,
    paddingHorizontal: 10,
    paddingVertical: 12,
  },
  logInput: {
    flex: 1,
    fontSize: 18,
    color: palette.text,
    marginLeft: 10,
  },
  tagShortRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 14,
  },
  tagShort: {
    backgroundColor: '#dfeae4',
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 8,
    fontSize: 15,
    color: palette.text,
  },
  setsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
  },
  setCircle: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#dfeae4',
    color: palette.text,
    textAlign: 'center',
    lineHeight: 42,
    fontWeight: '700',
  },
  setCell: {
    flex: 1,
    backgroundColor: '#edf4f2',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: palette.border,
    padding: 10,
    alignItems: 'center',
  },
  setCellLabel: {
    fontSize: 12,
    color: palette.primary,
    textTransform: 'uppercase',
    letterSpacing: 0.7,
    fontWeight: '700',
  },
  setCellValue: {
    fontSize: 26,
    color: palette.text,
    marginTop: 4,
  },
  addSetBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: palette.primary,
    borderRadius: 14,
    paddingVertical: 18,
    marginTop: 8,
    marginBottom: 18,
  },
  addSetText: {
    fontSize: 20,
    color: palette.primary,
    fontWeight: '700',
  },
  durationCard: {
    backgroundColor: '#edf4f2',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: palette.border,
    padding: 14,
  },
  sectionHeadingLarge: {
    fontSize: 40,
    color: palette.text,
    fontWeight: '700',
    paddingHorizontal: 18,
    marginTop: 12,
  },
  goalsIntro: {
    fontSize: 20,
    color: palette.muted,
    paddingHorizontal: 18,
    marginBottom: 18,
  },
  goalPanel: {
    backgroundColor: '#ebf5f2',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: palette.border,
    padding: 18,
    marginHorizontal: 18,
    marginBottom: 18,
  },
  goalPanelPink: {
    backgroundColor: '#f4e4e7',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: palette.border,
    padding: 18,
    marginHorizontal: 18,
    marginBottom: 18,
  },
  goalPanelHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  goalPanelLabel: {
    flex: 1,
    marginLeft: 10,
    fontSize: 28,
    fontWeight: '700',
    color: palette.text,
  },
  goalBadge: {
    backgroundColor: '#d7f0ea',
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 6,
    color: palette.primary,
    fontWeight: '700',
  },
  goalBadgePink: {
    backgroundColor: '#f8dbe1',
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 6,
    color: palette.red,
    fontWeight: '700',
  },
  goalBig: {
    fontSize: 38,
    fontWeight: '700',
    color: palette.text,
    marginTop: 8,
  },
  goalSmall: {
    fontSize: 18,
    color: palette.muted,
    marginBottom: 10,
  },
  goalSlider: {
    height: 16,
    backgroundColor: '#dfeae6',
    borderRadius: 999,
    marginTop: 8,
    position: 'relative',
  },
  sliderThumb: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: palette.primary,
    position: 'absolute',
    right: 0,
    top: -1,
  },
  goalRange: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    color: palette.muted,
    marginTop: 8,
  },
  goalSubline: {
    fontSize: 16,
    color: palette.muted,
    marginTop: 10,
  },
  goalSubValue: {
    color: palette.text,
    fontWeight: '700',
  },
  progressTrackSmall: {
    height: 12,
    backgroundColor: '#dfeae6',
    borderRadius: 999,
    overflow: 'hidden',
    marginTop: 10,
  },
  progressFillSmall: {
    height: '100%',
    backgroundColor: palette.primary,
    borderRadius: 999,
  },
  progressFillSmallPink: {
    height: '100%',
    backgroundColor: '#d97d8a',
    borderRadius: 999,
  },
  goalTip: {
    fontSize: 16,
    color: palette.text,
    marginTop: 10,
  },
  calloutCard: {
    backgroundColor: '#d7e5df',
    borderRadius: 18,
    padding: 20,
    marginHorizontal: 18,
    marginBottom: 30,
  },
  calloutTitle: {
    fontSize: 26,
    fontWeight: '700',
    color: palette.text,
    marginBottom: 8,
  },
  calloutText: {
    fontSize: 18,
    color: palette.text,
    lineHeight: 30,
    marginBottom: 14,
  },
  monthPanel: {
    backgroundColor: '#eff5f2',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: palette.border,
    padding: 18,
    marginHorizontal: 18,
    marginBottom: 18,
  },
  monthTitle: {
    fontSize: 36,
    fontWeight: '700',
    color: palette.text,
  },
  monthControls: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
    marginBottom: 12,
  },
  daysRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  dayCell: {
    alignItems: 'center',
    flex: 1,
  },
  dayWord: {
    fontSize: 16,
    color: palette.muted,
  },
  dayNumber: {
    fontSize: 24,
    color: palette.text,
    marginTop: 8,
  },
  daySelected: {
    backgroundColor: palette.primary,
    color: palette.white,
    width: 42,
    height: 42,
    borderRadius: 21,
    textAlign: 'center',
    lineHeight: 42,
  },
  historyWorkoutRow: {
    backgroundColor: '#edf4f2',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: palette.border,
    marginHorizontal: 18,
    marginBottom: 18,
    padding: 16,
    flexDirection: 'row',
    gap: 14,
  },
  workoutBadge: {
    width: 42,
    height: 42,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  historyWorkoutContent: {
    flex: 1,
  },
  historyHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  historyTitle: {
    fontSize: 26,
    fontWeight: '700',
    color: palette.text,
  },
  historyTime: {
    fontSize: 16,
    color: palette.muted,
  },
  historySubtitle: {
    fontSize: 18,
    color: palette.muted,
    marginTop: 2,
  },
  historyMetricRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
  },
  metricCol: {
    flex: 1,
  },
  metricKey: {
    fontSize: 12,
    color: palette.primary,
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    fontWeight: '700',
  },
  metricValueText: {
    fontSize: 20,
    color: palette.text,
    marginTop: 6,
    fontWeight: '700',
  },
  profileHeaderWrap: {
    alignItems: 'center',
    marginTop: 8,
  },
  profileAvatarBack: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#dfeae4',
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileName: {
    fontSize: 30,
    fontWeight: '700',
    color: palette.text,
    marginTop: 12,
  },
  profileEmail: {
    fontSize: 18,
    color: palette.muted,
  },
  settingsCard: {
    backgroundColor: '#edf4f2',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: palette.border,
    marginHorizontal: 18,
    padding: 16,
    marginTop: 20,
  },
  settingsTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: palette.text,
    marginBottom: 12,
  },
  labelRow: {
    fontSize: 14,
    color: palette.primary,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginTop: 10,
    marginBottom: 6,
  },
  settingsInput: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f9f8',
    borderWidth: 1,
    borderColor: palette.border,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    gap: 8,
    marginBottom: 10,
  },
  settingsValue: {
    fontSize: 20,
    color: palette.text,
  },
  prefRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginTop: 12,
  },
  prefLabel: {
    flex: 1,
    fontSize: 22,
    color: palette.text,
  },
  prefSelect: {
    fontSize: 16,
    color: palette.muted,
  },
  securityText: {
    fontSize: 18,
    color: palette.muted,
    lineHeight: 28,
    marginBottom: 12,
  },
  settingsCardMargin: {
    backgroundColor: '#edf4f2',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: palette.border,
    marginHorizontal: 18,
    padding: 16,
    marginTop: 20,
    marginBottom: 40,
  },
  tabBarWrap: {
    flexDirection: 'row',
    backgroundColor: '#edf3ef',
    borderTopWidth: 1,
    borderTopColor: '#dfe9e4',
    paddingTop: 8,
    paddingBottom: 12,
    paddingHorizontal: 10,
    alignItems: 'center',
    justifyContent: 'space-around',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  tabItem: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    paddingVertical: 6,
  },
  tabLabel: {
    fontSize: 12,
    color: palette.muted,
    marginTop: 4,
  },
  tabLabelActive: {
    fontWeight: '700',
    color: palette.primary,
  },
  logTabButton: {
    width: 74,
    height: 74,
    borderRadius: 37,
    backgroundColor: '#dfeae4',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: -18,
    borderWidth: 4,
    borderColor: '#edf3ef',
  },
  logTabSelected: {
    backgroundColor: palette.primary,
  },
  skeletonWrap: {
    padding: 18,
  },
  placeholderImage: {
    height: 220,
    borderRadius: 18,
    backgroundColor: '#dfeae4',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  skeletonLineShort: {
    height: 18,
    width: '32%',
    borderRadius: 9,
    backgroundColor: '#dfeae4',
    marginBottom: 10,
  },
  skeletonLineLong: {
    height: 18,
    width: '88%',
    borderRadius: 9,
    backgroundColor: '#dfeae4',
    marginBottom: 10,
  },
  skeletonLineLonger: {
    height: 18,
    width: '96%',
    borderRadius: 9,
    backgroundColor: '#dfeae4',
    marginBottom: 10,
  },
  offlinePanel: {
    margin: 18,
    backgroundColor: '#edf3ef',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: palette.border,
    padding: 20,
    alignItems: 'center',
  },
  offlineBadge: {
    width: 86,
    height: 86,
    borderRadius: 43,
    backgroundColor: '#dfeae4',
    alignItems: 'center',
    justifyContent: 'center',
  },
  offlineTitle: {
    fontSize: 26,
    fontWeight: '700',
    color: palette.text,
    marginTop: 18,
    marginBottom: 8,
  },
  offlineText: {
    fontSize: 18,
    color: palette.muted,
    textAlign: 'center',
    lineHeight: 28,
  },
  detailMetaGrid: {
    flexDirection: 'row',
    paddingHorizontal: 18,
    gap: 12,
    marginBottom: 12,
  },
  metaCard: {
    flex: 1,
    backgroundColor: '#edf3ef',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: palette.border,
    padding: 16,
    alignItems: 'center',
  },
  metaLabel: {
    fontSize: 12,
    color: palette.primary,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginTop: 8,
    fontWeight: '700',
  },
  metaValue: {
    fontSize: 18,
    fontWeight: '700',
    color: palette.text,
    marginTop: 6,
  },
});
