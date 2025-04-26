import namdongjinImage from '../assets/namdongjin.jpg';
import leeyuriImage from '../assets/leeyuri.jpg';
import kimjunhoImage from '../assets/kimjunho.jpg';
import jeongyeseulImage from '../assets/jeongyeseul.jpg';
import jeongdongseokImage from '../assets/jeongdongseok.jpg';
import gwakjunhyeongImage from '../assets/gwakjunhyeong.jpg';
import konaraeImage from '../assets/konarae.jpg';

const results = {
  남동진: {
    name: '남동진',
    description: '책임감 있고 리더십이 뛰어난 성격. 위기 상황에서도 침착하게 대처하며, 모두를 이끄는 데 능숙합니다.',
    image: namdongjinImage,
    compatibility: {
      primary: '이유리',
      primaryReason: '차분하고 배려 깊은 성향이 리더십과 조화를 이룸',
      secondary: '정예슬',
      secondaryReason: '밝은 에너지와 리더십의 시너지가 뛰어남'
    }
  },
  이유리: {
    name: '이유리',
    description: '차분하고 배려 깊은 성격. 위기 상황에서도 침착하게 대처하며, 주변 사람들을 잘 챙깁니다.',
    image: leeyuriImage,
    compatibility: {
      primary: '정동석',
      primaryReason: '조용하고 깊이 있는 성향의 안정된 조합',
      secondary: '고나래',
      secondaryReason: '내향적이지만 마음을 나누는 데 편안함을 주는 조합'
    }
  },
  김준호: {
    name: '김준호',
    description: '자유로운 영혼의 소유자. 귀찮은 일은 피하고 싶지만, 필요할 때는 어떻게든 해내는 스타일입니다.',
    image: kimjunhoImage,
    compatibility: {
      primary: '곽준형',
      primaryReason: '자유로운 성향 + 모험을 즐기는 외향성의 케미',
      secondary: '정예슬',
      secondaryReason: '귀찮음을 이겨내게 해줄 활기찬 파트너'
    }
  },
  정예슬: {
    name: '정예슬',
    description: '밝고 활발한 성격. 분위기를 주도하고 사람들과 잘 어울리는 타입입니다.',
    image: jeongyeseulImage,
    compatibility: {
      primary: '곽준형',
      primaryReason: '둘 다 밝고 에너지 넘치며 활발한 활동을 선호',
      secondary: '남동진',
      secondaryReason: '에너지와 책임감의 균형 있는 조화'
    }
  },
  정동석: {
    name: '정동석',
    description: '조용하고 내성적인 성격. 자신만의 페이스로 일을 처리하는 것을 선호합니다.',
    image: jeongdongseokImage,
    compatibility: {
      primary: '이유리',
      primaryReason: '내향적이고 안정적인 성향의 이상적인 궁합',
      secondary: '고나래',
      secondaryReason: '조용한 환경을 선호하는 공감대 + 편안한 관계'
    }
  },
  곽준형: {
    name: '곽준형',
    description: '모험을 즐기고 재미를 추구하는 성격. 어떤 상황에서도 긍정적으로 대처합니다.',
    image: gwakjunhyeongImage,
    compatibility: {
      primary: '김준호',
      primaryReason: '모험심과 자유를 추구하는 유쾌한 케미',
      secondary: '정예슬',
      secondaryReason: '밝고 활기찬 에너지의 시너지 조합'
    }
  },
  고나래: {
    name: '고나래',
    description: '내향적이지만 따뜻한 마음을 가진 성격. 진심으로 다가오는 사람에게는 마음을 열어줍니다.',
    image: konaraeImage,
    compatibility: {
      primary: '정동석',
      primaryReason: '조용하고 깊은 관계를 선호하는 둘의 공감대',
      secondary: '이유리',
      secondaryReason: '부드럽고 따뜻한 성격의 안정된 궁합'
    }
  }
};

// 결과를 계산하는 함수
export const getResult = (scores) => {
  // 가장 높은 점수를 받은 캐릭터 찾기
  let maxScore = -1;
  let maxCharacter = Object.keys(results)[0]; // 기본값으로 첫 번째 캐릭터 설정
  let tiedCharacters = [];

  Object.entries(scores).forEach(([character, score]) => {
    if (score > maxScore) {
      maxScore = score;
      maxCharacter = character;
      tiedCharacters = [character];
    } else if (score === maxScore) {
      tiedCharacters.push(character);
    }
  });

  // 동점자가 있는 경우 랜덤하게 선택
  if (tiedCharacters.length > 1) {
    const randomIndex = Math.floor(Math.random() * tiedCharacters.length);
    maxCharacter = tiedCharacters[randomIndex];
  }

  return results[maxCharacter];
};

export default results;
